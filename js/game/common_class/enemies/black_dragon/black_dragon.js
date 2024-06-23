/* ブラックドラゴンクラス */

// TODO: 未仕分け
import { Fire } from "./weapon/fire.js";
import { calculate_target_direction } from "../../../common_function/calculate_target_direction.js";

// 01_control

// 02_action
import { damaged } from "./methods/02_action/damaged.js";
import { is_damaged } from "../../z0_common_methods/02_action/damaged/is_damaged.js";

// 03_draw

// その他
import { is_overlapping_with } from "../../z0_common_methods/is_overlapping_with.js";
import { include } from "../../../../global_function/include.js";
import { ExpandedArray } from "../../../../global_class/expanded_array.js";

const HIT_BOX = {   // ブラックドラゴンの当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.35,    // 横幅
    height: 0.35,   // 縦幅
}
const COOL_TIME = { // それぞれの行動のクールタイム
    move: 24,        // 移動クールタイム（1歩で 24フレーム費やす）
    attack: 20,      // 攻撃クールタイム
}
const COLOR = {
    original: 0,    // 通常時の色 
    damaged: 1,     // 被ダメージ時の色
}
const FIRE_ATK_COEFFICIENT = 0.5;   // 直接、身体が触れる攻撃を 1 としたときの、炎の攻撃倍率。atk に 掛け算する。
const SPEED_COEFFICIENT = 0.083;        // ブラックドラゴンのスピードの係数
const ANIMATION_ORDER = [0, 1];         // アニメーションの流れ

export class BlackDragon {
    constructor(x, y, world_map_x, world_map_y, img, status){
        this.x = x;                                                            // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 敵キャラの画像の中心の座標とする
        this.y = y;                                                            // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 敵キャラの画像の中心の座標とする
        this.world_map_x = world_map_x;                                        // その敵キャラが生息する ワールドマップの x 座標
        this.world_map_y = world_map_y;                                        // その敵キャラが生息する ワールドマップの y 座標
        this.width = HIT_BOX.width;                                                     // 敵キャラの当たり判定の横幅 (タイル基準。すなわち 1 ならタイル1枚分)
        this.height = HIT_BOX.height;                                                   // 敵キャラの当たり判定の縦幅 (タイル基準。すなわち 1 ならタイル1枚分)
        this.img = img;                                                                 // 写真 (original: 通常時, damaged: 被ダメージ時)
        this.speed_coefficient = SPEED_COEFFICIENT;                                     // 移動スピード係数
        this.direction = 0;                                                             // 身体の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.color = COLOR.original;                                                    // 色(通常時: COLOR.original, 被ダメージ時: COLOR.damaged)
        this.animation_frame = 0;                                                       // 写真のアニメーション (0 と 1 と 2 と 3 を 交互に変えてアニメーションを実現する)
        this.animation_order = ANIMATION_ORDER;                                         // アニメーションの流れ
        this.in_action_frame = {
            move: 0,                                                                    // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                                                                  // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
            damaged: 0,                                                                 // 被ダメージフレーム数。一回ダメージを受けたら、このフレーム分は無敵。
        };
        this.is_taking_a_break = false;                                                 // 行動しない状態かどうか
        this.status = status;                                                           // 敵キャラのステータス (hp, 攻撃力(atk))

        this.max_hp = status.hp; // 最大HP
        this.fires = new ExpandedArray(); // 放った炎
    }

    control(_player){
        // 行動中であれば、受け付けない
        if(this.in_action_frame.move > 0) return;

        // クールタイムをリセット
        this.in_action_frame.move = COOL_TIME.move;

        // 左に歩いたら右に。右に歩いたら今度は左に動く
        // 2: 左, 3: 右
        this.direction == 2 ? this.direction = 3 : this.direction = 2;
    }

    action(player, enemies, tile_size_in_canvas){
        this.move();
        this.attack(player, tile_size_in_canvas);

        // 被ダメージ系
        this.protected(player, tile_size_in_canvas);
        this.damaged(player, enemies, tile_size_in_canvas);
    }

    move(){
        // 炎を動かす
        for(let fire of this.fires){
            fire.move(this.fires);
        }

        const NUM_OF_ANIMATION_FLAME = ANIMATION_ORDER.length;      // アニメーションの数 (2 フレーム 1 セットでアニメーションする)

        // 半歩に1回、アニメーションを動かす
        if(this.in_action_frame.move == Math.floor(COOL_TIME.move * 0.5)) this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす

        // アクションが終了したら、動作は行わない (次の動作命令に向けて待機)
        if(this.in_action_frame.move <= 0) return;

        // 移動する
        if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
        if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
        
        // 動作フレームを 1 進める
        this.in_action_frame.move--;

        // MOVE_COOL_TIME に 1回 (in_action_frame.move が 0 になったとき) だけ、
        if(this.in_action_frame.move > 0) return;

        // 座標の誤差を補正する
        this.x = Math.round(this.x * 2) * 0.5;
        this.y = Math.round(this.y * 2) * 0.5;

        // アニメーションを動かす
        this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす
    }

    // 攻撃判定
    // プレイヤーキャラと重なったら、ダメージを与える
    // action メソッドから呼び出される
    attack(player, tile_size_in_canvas){
        // 炎の攻撃判定
        for(let fire of this.fires){
            fire.attack(player, this.status.atk * FIRE_ATK_COEFFICIENT, tile_size_in_canvas);
        }

        // 体当たりの攻撃判定
        if(
            player.x * tile_size_in_canvas + player.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 1.5 &&
            this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 1.5 >= player.x * tile_size_in_canvas - player.width * tile_size_in_canvas * 0.5 &&
            player.y * tile_size_in_canvas + player.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 2.5 &&
            this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 1.5 >= player.y * tile_size_in_canvas - player.height * tile_size_in_canvas * 0.5
        ){
            const INVINCIBLE_FRAME = 30;
            player.is_damaged(this.status.atk, INVINCIBLE_FRAME);
        }

        if(this.in_action_frame.attack <= 0){
            this.in_action_frame.attack = COOL_TIME.attack;
        }

        if(this.in_action_frame.attack == COOL_TIME.attack){
            let adjustment = { // 口から炎を吐き出すための位置の調整値 (タイル単位)
                x: -0.3,
                y: -0.4,
            }
            let [vx, vy] = calculate_target_direction(this.x + adjustment.x, this.y + adjustment.y, player.x, player.y);
            let fire = new Fire(this.x + adjustment.x, this.y + adjustment.y, vx, vy, this.img.fire);
            this.fires.push(fire);
        }

        // 攻撃フレームを 1 進める
        this.in_action_frame.attack--;
    }

    // 弱点以外のところに当たった弓矢を消去
    // action メソッドから呼び出される
    protected(player, tile_size_in_canvas){
        // 自分の弓矢が弱点じゃない部分に当たったら
        for(let arrow of player.arrows){
            if(
                // 上半分
                arrow.x * tile_size_in_canvas + arrow.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 2.5 &&
                this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 2.5 >= arrow.x * tile_size_in_canvas - arrow.width * tile_size_in_canvas * 0.5 &&
                arrow.y * tile_size_in_canvas + arrow.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 2.5 &&
                this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 >= arrow.y * tile_size_in_canvas - arrow.height * tile_size_in_canvas * 0.5 ||
                // 下半分
                arrow.x * tile_size_in_canvas + arrow.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 2.5 &&
                this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 2.5 >= arrow.x * tile_size_in_canvas - arrow.width * tile_size_in_canvas * 0.5 &&
                arrow.y * tile_size_in_canvas + arrow.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 &&
                this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 2.5 >= arrow.y * tile_size_in_canvas - arrow.height * tile_size_in_canvas * 0.5
            ){
                // 当たった弓矢を消去するだけ
                player.arrows.delete(arrow);
            }
        }
    }

    draw(canvas, context, tile_size_in_canvas){
        // 炎の描画
        for(let fire of this.fires){
            fire.draw(canvas, context, tile_size_in_canvas);
        }

        // ブラックドラゴン自身の描画
        let enemy_img;
        // 色を画像に反映
        if(this.color == COLOR.original) enemy_img = this.img.original[this.animation_frame];
        else if(this.color == COLOR.damaged) enemy_img = this.img.damaged[this.animation_frame];

        context.drawImage(
            enemy_img, // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 1,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 1,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas * 2,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas * 2,  // d_height (canvas の描画サイズ 縦幅)
        );

        //////
        // // デバッグ用。当たり判定を四角形で描画する
        // // 無効判定(上半身)
        // context.fillStyle = "rgb(255, 100, 100)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 2.5,
        //     this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 2.5,
        //     this.width * tile_size_in_canvas * 5,
        //     this.height * tile_size_in_canvas * 2,
        // );

        // // 無効判定(下半身)
        // context.fillStyle = "rgb(255, 100, 100)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 2.5,
        //     this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5,
        //     this.width * tile_size_in_canvas * 5,
        //     this.height * tile_size_in_canvas * 2,
        // );

        // // 体当たりによる攻撃判定
        // context.fillStyle = "rgb(100, 100, 255)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 1.5,
        //     this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 2.5,
        //     this.width * tile_size_in_canvas * 3,
        //     this.height * tile_size_in_canvas * 4,
        // );

        // // ダメージ判定
        // context.fillStyle = "rgb(255, 255, 255)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5,
        //     this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5,
        //     this.width * tile_size_in_canvas,
        //     this.height * tile_size_in_canvas,
        // );
        //////

        // HPバーの描画
        const HP_BAR_WIDTH_COEFFICIENT = 0.25;              // HPバーの幅に係る係数
        const HP_BAR_HEIGHT_COEFFICIENT = 0.015;            // HPバーの高さに係る係数
        const HP_BAR_OUTSIDE_WIDTH_COEFFICIENT = 1;         // HPバーの外側の白い部分の横のサイズ比
        const HP_BAR_OUTSIDE_HEIGHT_COEFFICIENT = 1;        // HPバーの外側の白い部分の縦のサイズ比
        const HP_BAR_INSIDE_WIDTH_COEFFICIENT = 0.96;       // HPバーの内側の赤い部分の横のサイズ比
        const HP_BAR_INSIDE_HEIGHT_COEFFICIENT = 0.4;       // HPバーの内側の赤い部分の縦のサイズ比

        const HP_BAR_X = 0.86;  // canvas の横幅を 1 としたときの HPバーの横の中心 x座標
        const HP_BAR_Y = 0.02;  // canvas の縦幅を 1 としたときの HPバーの横の中心 y座標
        const OUTSIDE_WIDTH = canvas.width * HP_BAR_WIDTH_COEFFICIENT * HP_BAR_OUTSIDE_WIDTH_COEFFICIENT;       // HPバーの外側横幅
        const OUTSIDE_HEIGHT = canvas.height * HP_BAR_HEIGHT_COEFFICIENT * HP_BAR_OUTSIDE_HEIGHT_COEFFICIENT;   // HPバーの外側縦幅
        const INSIDE_WIDTH = canvas.width * HP_BAR_WIDTH_COEFFICIENT * HP_BAR_INSIDE_WIDTH_COEFFICIENT;         // HPバーの内側の横幅
        const INSIDE_HEIGHT = canvas.height * HP_BAR_HEIGHT_COEFFICIENT * HP_BAR_INSIDE_HEIGHT_COEFFICIENT;     // HPバーの内側の縦幅

        // 外側の白い部分
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillRect(
            canvas.width * HP_BAR_X - OUTSIDE_WIDTH * 0.5,
            canvas.height * HP_BAR_Y - OUTSIDE_HEIGHT * 0.5,
            OUTSIDE_WIDTH,
            OUTSIDE_HEIGHT,
        );

        // HPバーの内側の黒色の部分
        context.fillStyle = "rgb(0, 0, 0)";
        context.fillRect(
            canvas.width * HP_BAR_X - INSIDE_WIDTH * 0.5,
            canvas.height * HP_BAR_Y - INSIDE_HEIGHT * 0.5,
            INSIDE_WIDTH,
            INSIDE_HEIGHT,
        );

        // HPバーの内側のオレンジ色の部分
        context.fillStyle = "rgb(255, 120, 0)";
        context.fillRect(
            canvas.width * HP_BAR_X - INSIDE_WIDTH * 0.5,
            canvas.height * HP_BAR_Y - INSIDE_HEIGHT * 0.5,
            INSIDE_WIDTH * (this.status.hp / this.max_hp),
            INSIDE_HEIGHT,
        );
    }
}

// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。

// 01_control


// 02_action
include(BlackDragon, damaged);
include(BlackDragon, is_damaged);

// 03_draw

// その他
include(BlackDragon, is_overlapping_with);
