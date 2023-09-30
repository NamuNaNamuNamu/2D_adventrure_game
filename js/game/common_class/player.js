/* プレイヤーキャラクターを表すクラス */

import { Arrow } from "./arrow.js";

const PLAYER_SPEED_COEFFICIENT = 0.33;    // 弓矢のスピードの係数
const ATTACK_COOL_TIME = 10; // 攻撃クールタイム

export class Player{
    
    // コンストラクタ
    constructor(x, y, world_map_x, world_map_y, img){
        this.x = x;                         // x 座標(タイル基準 = 一番左が 1, 一番右が 16), プレイヤーの画像の中心の座標とする
        this.y = y;                         // y 座標(タイル基準 = 一番上が 1, 一番下が 16), プレイヤーの画像の中心の座標とする
        this.world_map_x = world_map_x;     // 現在プレイヤーがいる ワールドマップの x 座標
        this.world_map_y = world_map_y;     // 現在プレイヤーがいる ワールドマップの y 座標
        this.img = img;                     // 写真 (front: 正面, back: 背面, left: 左, right: 右)
        this.direction = 0;                 // 身体の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.animation_frame = 0;           // 写真のアニメーション (0 と 1 を交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                        // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                      // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
        };
        this.arrows = [];                   // 放った弓矢
    }

    // プレイヤーの操作を反映
    control(key){
        // 移動アクション中でなければ、操作を受け付ける
        if(this.in_action_frame.move <= 0){
            // w, a, s, d キー入力に応じて移動させる
            if(key.is_w_pressed){ 
                this.direction = 0;
                this.in_action_frame.move = 3; // 3フレーム使って実際には移動する
            }
            else if(key.is_s_pressed){
                this.direction = 1;
                this.in_action_frame.move = 3; // 3フレーム使って実際には移動する
            }
            else if(key.is_a_pressed){
                this.direction = 2;
                this.in_action_frame.move = 3; // 3フレーム使って実際には移動する
            }
            else if(key.is_d_pressed){
                this.direction = 3;
                this.in_action_frame.move = 3; // 3フレーム使って実際には移動する
            }
        }

        // 攻撃アクション中でなければ、操作を受け付ける
        if(this.in_action_frame.attack <= 0){
            if(key.is_enter_pressed){
                this.in_action_frame.attack = ATTACK_COOL_TIME; // 攻撃クールタイムがある
            }
        }
    }

    // 実際の動作処理を行う
    action(){
        this.move();
        this.attack();
    }

    move(){
        // 弓矢を動かす
        for(let arrow of this.arrows){
            arrow.move(this.arrows);
        }

        // アクションが終了したら、プレイヤーの動作は行わない (次の動作命令に向けて待機)
        if(this.in_action_frame.move <= 0) return;

        // キー入力に応じて移動させる
        if(this.direction == 0) this.y = Math.round((this.y - MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 1) this.y = Math.round((this.y + MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;

        // 動作フレームを 1 進める
        this.in_action_frame.move--;
        // 動作しきったタイミングで、
        if(this.in_action_frame.move == 0){
            // 座標の誤差を補正する
            this.x = Math.round(this.x * 2) * 0.5;
            this.y = Math.round(this.y * 2) * 0.5;
            // アニメーションを 1 動かす(0 なら 1 に。1 なら 0 に)
            this.animation_frame = (this.animation_frame + 1) % 2;
        }

        // マップ移動処理
        if(this.x < 0){
            this.x += FIELD_SIZE_IN_SCREEN;
            this.world_map_x--;
        }
        if(this.x > FIELD_SIZE_IN_SCREEN){
            this.x -= FIELD_SIZE_IN_SCREEN;
            this.world_map_x++;
        }
        if(this.y < 0){
            this.y += FIELD_SIZE_IN_SCREEN;
            this.world_map_y--;
        }
        if(this.y > FIELD_SIZE_IN_SCREEN){
            this.y -= FIELD_SIZE_IN_SCREEN;
            this.world_map_y++;
        }
    }

    attack(){
        // アクションが終了したら、動作は行わない
        if(this.in_action_frame.attack <= 0) return;

        // 攻撃命令を受け付けたその時だけ弓矢を生成
        if(this.in_action_frame.attack == ATTACK_COOL_TIME){
            let arrow = new Arrow(this.x, this.y, this.direction, this.img.arrow);
            this.arrows.push(arrow);
        }

        // 攻撃フレームを 1 進める
        this.in_action_frame.attack--;
    }

    // 描画する
    draw(canvas, context, tile_size_in_canvas){
        // 弓矢の描画
        for(let arrow of this.arrows){
            arrow.draw(canvas, context, tile_size_in_canvas);
        }

        // プレイヤー自身の描画
        let player_img;
        if(this.direction == 0) player_img = this.img.back[this.animation_frame];
        if(this.direction == 1) player_img = this.img.front[this.animation_frame];
        if(this.direction == 2) player_img = this.img.left[this.animation_frame];
        if(this.direction == 3) player_img = this.img.right[this.animation_frame];

        context.drawImage(
            player_img, // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}