/* 炎攻撃クラス */

const FIRE_SPEED_COEFFICIENT = 0.60;    // 炎のスピードの係数
const FIRE_WIDTH = 0.5;                 // 炎の当たり判定の横幅
const FIRE_HEIGHT = 0.5;                // 炎の当たり判定の縦幅

const ANIMATION_ORDER = [0, 1];         // アニメーションの流れ
const ANIMATION_TRANSITION_FRAME = 5;   // アニメーションを何フレームに1度動かすか

export class Fire{
    constructor(x, y, vx, vy, img){
        this.x = x;                                                             // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 炎の画像の中心の座標とする
        this.y = y;                                                             // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 炎の画像の中心の座標とする
        this.width = FIRE_WIDTH;                                                // 炎の当たり判定の横幅
        this.height = FIRE_HEIGHT;                                              // 炎の当たり判定の縦幅
        this.vx = vx;                                                           // 炎の x 方向のスピード(タイル基準) 
        this.vy = vy;                                                           // 炎の y 方向のスピード(タイル基準)
        this.img = img;                                                         // 写真
        this.animation_frame = 0;                                               // 写真のアニメーション (0 と 1 を 交互に変えてアニメーションを実現する)
        this.animation_transition_frame_remain = ANIMATION_TRANSITION_FRAME;    // アニメーションを動かすタイミングまでの残りフレーム数
    }

    // 炎の移動処理
    move(fires){
        this.animation_transition_frame_remain--;

        this.x = Math.round((this.x + this.vx * MINIMUM_STEP * FIRE_SPEED_COEFFICIENT) * 100) / 100;
        this.y = Math.round((this.y + this.vy * MINIMUM_STEP * FIRE_SPEED_COEFFICIENT) * 100) / 100;

        // もし、場外に出たら、炎を削除
        if(this.x < -0.5 || 
        this.x > FIELD_SIZE_IN_SCREEN + 0.5 || 
        this.y < -0.5 || 
        this.y > FIELD_SIZE_IN_SCREEN + 0.5){
            fires.splice(fires.indexOf(this), 1);
        }

        // アニメーションを動かすタイミングなら、動かしてクールタイムをリセット
        if(this.animation_transition_frame_remain > 0) return;

        this.animation_frame = (this.animation_frame + 1) % ANIMATION_ORDER.length; // アニメーションを 1 動かす
        this.animation_transition_frame_remain = ANIMATION_TRANSITION_FRAME;
    }

    // 攻撃処理
    attack(player, damage, tile_size_in_canvas){
        if(
            player.x * tile_size_in_canvas + player.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5 &&
            this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 0.5 >= player.x * tile_size_in_canvas - player.width * tile_size_in_canvas * 0.5 &&
            player.y * tile_size_in_canvas + player.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 &&
            this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 >= player.y * tile_size_in_canvas - player.height * tile_size_in_canvas * 0.5
        ){
            const INVINCIBLE_FRAME = 30;
            player.is_damaged(damage, INVINCIBLE_FRAME);
        }
    }

    // 炎の描画処理
    draw(canvas, context, tile_size_in_canvas){
        context.drawImage(
            this.img[this.animation_frame], // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}