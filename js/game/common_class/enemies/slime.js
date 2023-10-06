/* スライムクラス */

import { Enemy } from "./../enemy.js";

const WIDTH = 0.35;   // スライムの当たり判定の横幅
const HEIGHT = 0.35;  // スライムの当たり判定の縦幅
const SPEED_COEFFICIENT = 0.111;        // スライムのスピードの係数 (≒ 1 ÷ MOVE_COOL_TIME)
const MOVE_COOL_TIME = 9;               // 移動クールタイム（1歩で 9フレーム費やす）
const NUM_OF_MOVE_PATTERN = 10;         // 全行動パターン数
const ANIMATION_ORDER = [0, 1, 2, 1];  // アニメーションの流れ
const MAP_CHIP_WHICH_SLIME_CANNOT_MOVE_ON = [ // スライムが移動できない床
    2,  // 海
    4,  // 剣のマークの看板
    8,  // 木
    9,  // 岩
    10, // テーブル
    11, // 石レンガ
    15, // 石レンガ(壁)
];

export class Slime extends Enemy{
    constructor(x, y, world_map_x, world_map_y, img, hp, atk){
        super(x, y, world_map_x, world_map_y, WIDTH, HEIGHT, img, MAP_CHIP_WHICH_SLIME_CANNOT_MOVE_ON, SPEED_COEFFICIENT, ANIMATION_ORDER, hp, atk);
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
        this.in_action_frame.move = MOVE_COOL_TIME;

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