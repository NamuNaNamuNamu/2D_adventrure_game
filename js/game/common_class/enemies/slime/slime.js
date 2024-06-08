/* スライムクラス */

import { check_movability } from "../z0_common_methods/01_control/check_movability.js";
import { move } from "./methods/02_action/move.js";
import { attack } from "./methods/02_action/attack.js";
import { damaged } from "./methods/02_action/damaged.js";
import { is_damaged } from "./methods/02_action/damaged/is_damaged.js";
import { is_blown_away } from "./methods/02_action/damaged/is_damaged/is_blown_away.js"
import { include } from "../../../../global_function/include.js";
import { get_random_int } from "../../../../global_function/get_random_int.js";

const HIT_BOX = {   // スライムの当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.35,    // 横幅
    height: 0.35,   // 縦幅
}
const COOL_TIME = { // それぞれの行動のクールタイム
    move: 9,        // 移動クールタイム（1歩で 9フレーム費やす）
}
const COLOR = {
    original: 0,    // 通常時の色 
    damaged: 1,     // 被ダメージ時の色
}
const SPEED_COEFFICIENT = 0.111;        // スライムのスピードの係数 (≒ 1 ÷ COOL_TIME.move)
const ANIMATION_ORDER = [0, 1, 2, 1];  // アニメーションの流れ
const MAP_CHIP_WHICH_SLIME_CANNOT_MOVE_ON = [ // スライムが移動できない床
    2,  // 木付き草原
    3,  // 岩付き草原
    7,  // 木付き深い草原
    8,  // 岩付き深い草原
    12, // 木付き砂原
    13, // 岩付き砂原
    15, // テーブル
    18, // 木付き深い砂原
    19, // 岩付き深い砂原
    23, // 扉付き青床
    26, // 扉付き紫床
    28, // 石レンガ (灰色)
    29, // 石レンガ壁 (灰色)
    30, // 石レンガ (青色)
    31, // 石レンガ壁 (青色)
    33, // 木付き青床
    34, // 岩つき青床
    37, // 木付き紫床
    38, // 岩付き紫床
    40, // 海
    41, // 深い海
];

export class Slime{
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
    }

    // 行動を決定する
    // COOL_TIME.move フレームに 1 度行う
    // direction, in_action_frame.move, is_taking_a_break を変更し、行動の準備をする
    // 1. マップ外にいる場合 (x 座標が 0 以下 もしくは 16 以上、または y 座標が 0 以下 もしくは 16 以上)
    //     1-1. マップ内に戻るように動く
    // 2. マップ内にいる場合 1 ~ 100 のうちランダムな整数を決める
    //     2-1. ランダムな整数が 41 ~ 100 の場合、動かない
    //     2-2. ランダムな整数が  1 ~  10 の場合、上に動く
    //     2-3. ランダムな整数が 11 ~  20 の場合、下に動く
    //     2-4. ランダムな整数が 21 ~  30 の場合、左に動く
    //     2-5. ランダムな整数が 31 ~  40 の場合、右に動く
    control(player){
        // クールタイム (移動) 中であれば、受け付けない
        if(this.in_action_frame.move > 0) return;

        // クールタイムをリセット
        this.in_action_frame.move = COOL_TIME.move;
    
        const DIRECTION = {
            up: 0,
            down: 1,
            left: 2,
            right: 3
        }

        const on_the_bottom_edge = this.y >= FIELD_SIZE_IN_SCREEN;
        const on_the_top_edge = this.y <= 0;
        const on_the_right_edge = this.x >= FIELD_SIZE_IN_SCREEN;
        const on_the_left_edge = this.x <= 0;
        const on_the_outside_of_the_map = (on_the_bottom_edge || on_the_top_edge || on_the_right_edge || on_the_left_edge);

        const go_back_inside_the_map = () => {
            if(on_the_bottom_edge) this.direction = DIRECTION.up;
            if(on_the_top_edge)    this.direction = DIRECTION.down;
            if(on_the_right_edge)  this.direction = DIRECTION.left;
            if(on_the_left_edge)   this.direction = DIRECTION.right;
        }

        // マップ外にいる場合、マップ内に戻るように動く
        // 戻ることを決めたなら、移動可能性チェックは必要ないので、メソッド終了
        if(on_the_outside_of_the_map){
            go_back_inside_the_map();
            return;
        }

        // マップ内にいる場合、ランダムに行動を決める
        const random_num = get_random_int({min: 1, max: 100});
        if(41 <= random_num && random_num <= 100){
            this.is_taking_a_break = true;
            return;
        }

        const decide_direction_from_random_int = (random_num) => {
            if( 1 <= random_num && random_num <=  10) return DIRECTION.up;
            if(11 <= random_num && random_num <=  20) return DIRECTION.down;
            if(21 <= random_num && random_num <=  30) return DIRECTION.left;
            if(31 <= random_num && random_num <=  40) return DIRECTION.right;
        }
        let direction = decide_direction_from_random_int(random_num);

        // 決めた方向に移動可能かどうか確かめる => 不可能なら、動作命令は解除 (this.in_action_frame.move を 0 に)
        if(check_movability(this.x, this.y, this.world_map_x, this.world_map_y, direction, MAP_CHIP_WHICH_SLIME_CANNOT_MOVE_ON) == false){
            this.in_action_frame.move = 0;
            return;
        }

        this.direction = direction;
    }

    // 敵キャラを行動させる
    // game.js の メインループから呼び出される
    action(player, enemies, tile_size_in_canvas){
        this.move();
        this.attack(player, tile_size_in_canvas);
        this.damaged(player, enemies, tile_size_in_canvas);
    }

    // 描画処理
    // game.js の メインループから呼び出される
    draw(canvas, context, tile_size_in_canvas){
        const TOP_LEFT_CORNER_AXIS = {          // マップチップ本体の左上端
            x: 0,
            y: 0,
        };
        const TILE = {
            width: 32,  // マップチップ画像上でのマップチップ 1つ分の幅
            height: 32, // マップチップ画像上でのマップチップ 1つ分の幅
        };
        const DIRECTION_ORDER = [3, 0, 1, 2]; // 向きと写真の順番を合わせるための配列
        const MARGIN_LEFT = 6;
        const MARGIN_RIGHT = 6;
        const MARGIN_TOP = 12;
        const MARGIN_BOTTOM = 0;

        let enemy_img;
        // 色を画像に反映
        if(this.color == COLOR.original) enemy_img = this.img.original;
        else if(this.color == COLOR.damaged) enemy_img = this.img.damaged;

        context.drawImage(
            enemy_img, // img
            TOP_LEFT_CORNER_AXIS.x + MARGIN_LEFT + this.animation_order[this.animation_frame] * TILE.width,  // sx (元画像の切り抜き始点 x)
            TOP_LEFT_CORNER_AXIS.y + MARGIN_TOP + DIRECTION_ORDER[this.direction] * TILE.height,  // sy (元画像の切り抜き始点 y)
            TILE.width - (MARGIN_LEFT + MARGIN_RIGHT),  // s_width (元画像の切り抜きサイズ 横幅)
            TILE.height - (MARGIN_TOP + MARGIN_BOTTOM),  // s_height (元画像の切り抜きサイズ 縦幅)
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}

// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。
include(Slime, move);
include(Slime, attack);
include(Slime, damaged);
include(Slime, is_damaged);
include(Slime, is_blown_away);