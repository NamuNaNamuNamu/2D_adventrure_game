// ブラックドラゴンの移動処理

import { COOL_TIME } from "../../black_dragon.js";
import { ANIMATION_ORDER } from "../../black_dragon.js";

export function move(){
    // 炎を動かす
    for(let fire of this.fires){
        fire.move(this.fires);
    }

    // アクションが終了したら、動作は行わない (次の動作命令に向けて待機)
    if(this.in_action_frame.move <= 0) return;

    // 移動する
    if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
    if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
    
    // 動作フレームを 1 進める
    this.in_action_frame.move--;

    // 半歩に1回、アニメーションを動かす
    const NUM_OF_ANIMATION_FLAME = ANIMATION_ORDER.length; // アニメーションの数
    if(this.in_action_frame.move == Math.floor(COOL_TIME.move * 0.5)) this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす

    // MOVE_COOL_TIME に 1回 (in_action_frame.move が 0 になったとき) だけ、
    if(this.in_action_frame.move > 0) return;

    // 座標の誤差を補正する
    this.x = Math.round(this.x * 2) * 0.5;
    this.y = Math.round(this.y * 2) * 0.5;

    // アニメーションを動かす
    this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす
}