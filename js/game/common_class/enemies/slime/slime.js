/* スライムクラス */

import { Enemy } from "../../enemy.js";
import { should_go_back_inside_the_map } from "./methods/01_control/should_go_back_inside_the_map.js";
import { check_movability } from "./methods/01_control/check_movability.js";
import { move } from "./methods/02_action/move.js";
import { attack } from "./methods/02_action/attack.js";
import { damaged } from "./methods/02_action/damaged.js";
import { is_damaged } from "./methods/02_action/damaged/is_damaged.js";
import { is_blown_away } from "./methods/02_action/damaged/is_damaged/is_blown_away.js"

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
const NUM_OF_MOVE_PATTERN = 10;         // 全行動パターン数
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
        this.map_chip_which_enemy_cannot_move_on = MAP_CHIP_WHICH_SLIME_CANNOT_MOVE_ON; // その敵キャラが移動できない床
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
    // game.js の メインループから呼び出される
    // direction と、in_action_frame.move, is_taking_a_break を変更し、行動の準備をする。
    // 1. 0 ~ NUM_OF_MOVE_PATTERN のうち 1 パターンに行動が決まる
    //     1-1. パターンが 4 ~ NUM_OF_MOVE_PATTERN の場合、動かない
    //     1-2. パターンが 0 ~ 3 の場合、0: 上, 1: 下, 2: 左, 3: 右 に動く
    control(player){
        // 行動中であれば、受け付けない
        if(this.in_action_frame.move > 0) return;

        // クールタイムをリセット
        this.in_action_frame.move = COOL_TIME.move;

        // 行動をランダムで決める
        let pattern = Math.floor(Math.random() * NUM_OF_MOVE_PATTERN);

        // 4 ~ NUM_OF_MOVE_PATTERN の場合 => 動かない
        if(pattern >= 4 && pattern <= NUM_OF_MOVE_PATTERN){
            this.is_taking_a_break = true;
            return;
        }

        // 0 ~ 3 の場合 => 0: 上, 1: 下, 2: 左, 3: 右
        this.direction = pattern;

        // マップの端に行ったら、マップ外に出ないように戻る
        // 戻ることを決めたなら、移動可能性チェックは必要ないので、メソッド終了
        if(this.should_go_back_inside_the_map()) return;

        // 決めた方向に移動可能かどうか確かめる => 不可能なら、動作命令は解除 (this.in_action_frame.move を 0 に)
        if(this.check_movability(this.direction) == false) this.in_action_frame.move = 0;
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

// NOTE: これは、mixin 処理。Slime クラスに 2 つ目の引数の {} の中にあるメソッドを追加する
// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。
// TODO: うまいことメソッド化する。include みたいな。
Object.assign(Slime.prototype, {move});
Object.assign(Slime.prototype, {attack});
Object.assign(Slime.prototype, {damaged});
Object.assign(Slime.prototype, {check_movability});
Object.assign(Slime.prototype, {should_go_back_inside_the_map});
Object.assign(Slime.prototype, {is_damaged});
Object.assign(Slime.prototype, {is_blown_away});