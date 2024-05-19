/* スライムクラス */

import { Enemy } from "./../enemy.js";

const HIT_BOX = {   // スライムの当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.35,    // 横幅
    height: 0.35,   // 縦幅
}
const COOL_TIME = { // それぞれの行動のクールタイム
    move: 9,        // 移動クールタイム（1歩で 9フレーム費やす）
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

export class Slime extends Enemy{
    constructor(x, y, world_map_x, world_map_y, img, status){
        const location = {
            x: x,
            y: y,
            world_map_x: world_map_x,
            world_map_y: world_map_y
        };
        super(location, HIT_BOX, img, MAP_CHIP_WHICH_SLIME_CANNOT_MOVE_ON, SPEED_COEFFICIENT, ANIMATION_ORDER, status);
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
        if(this.stay_in_the_map()) return;

        // 決めた方向に移動可能かどうか確かめる => 不可能なら、動作命令は解除 (this.in_action_frame.move を 0 に)
        if(this.check_movability(this.direction) == false) this.in_action_frame.move = 0;
    }
}