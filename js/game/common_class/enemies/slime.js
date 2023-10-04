/* スライムクラス */

import { Enemy } from "./../enemy.js";

const SPEED_COEFFICIENT = 0.11;         // スライムのスピードの係数
const MOVE_COOL_TIME = 9;               // 移動クールタイム（1歩で 3フレーム費やす）
const NUM_OF_MOVE_PATTERN = 10;         // 全行動パターン数
const NUM_OF_ANNIMATION_FLAME = 4;      // アニメーションの数 (4 フレーム 1 セットでアニメーションする)
const ANNIMATION_ORDER = [0, 1, 2, 1];  // アニメーションの流れ

export class Slime extends Enemy{
    constructor(x, y, world_map_x, world_map_y, img, hp, attack){
        super(x, y, world_map_x, world_map_y, img, hp, attack);
    }  
    
    // スライムを行動させる
    action(){
        this.move();
    }

    // スライムを実際に動かす。
    // 1. MOVE_COOL_TIME ごとに、アニメーションを動かす
    // 2. MOVE_COOL_TIME ごとに、0 ~ NUM_OF_MOVE_PATTERN のうち 1 パターンに行動が決まる
    //     2-1. パターンが 4 ~ NUM_OF_MOVE_PATTERN の場合、動かない
    //     2-2. パターンが 0 ~ 3 の場合、0: 上, 1: 下, 2: 左, 3: 右 に動く
    move(){
        // 動作フレームを 1 進める
        this.in_action_frame.move--;

        // 休憩じゃなければ移動する
        if(this.direction == 0 && !this.is_taking_a_break) this.y = Math.round((this.y - MINIMUM_STEP * SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 1 && !this.is_taking_a_break) this.y = Math.round((this.y + MINIMUM_STEP * SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 2 && !this.is_taking_a_break) this.x = Math.round((this.x - MINIMUM_STEP * SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 3 && !this.is_taking_a_break) this.x = Math.round((this.x + MINIMUM_STEP * SPEED_COEFFICIENT) * 100) / 100;
        

        // MOVE_COOL_TIME に 1回 (in_action_frame.move が 0 になったとき) だけ、動く向きを決定する
        if(this.in_action_frame.move > 0) return;

        // 座標の誤差を補正する
        this.x = Math.round(this.x * 2) * 0.5;
        this.y = Math.round(this.y * 2) * 0.5;

        // アニメーションを動かす
        this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANNIMATION_FLAME; // アニメーションを 1 動かす
        
        // 休み状態を解消
        this.is_taking_a_break = false;

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
    }

    // 描画する
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
        const MERGIN_LEFT = 4;
        const MERGIN_RIGHT = 4;
        const MERGIN_TOP = 8;

        context.drawImage(
            this.img, // img
            TOP_LEFT_CORNER_AXIS.x + MERGIN_LEFT + ANNIMATION_ORDER[this.animation_frame] * TILE.width,  // sx (元画像の切り抜き始点 x)
            TOP_LEFT_CORNER_AXIS.y + MERGIN_TOP + DIRECTION_ORDER[this.direction] * TILE.height,  // sy (元画像の切り抜き始点 y)
            TILE.width - MERGIN_RIGHT,  // s_width (元画像の切り抜きサイズ 横幅)
            TILE.height,  // s_height (元画像の切り抜きサイズ 縦幅)
            this.x * tile_size_in_canvas,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}