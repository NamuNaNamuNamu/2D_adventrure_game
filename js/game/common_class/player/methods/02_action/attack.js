// プレイヤーの攻撃命令 を受けて、弓矢を生成する
// action メソッドから呼び出される

import { Arrow } from "../../weapon/arrow.js";
import { COOL_TIME } from "../../player.js";

export function attack(){
    // アクションが終了したら、動作は行わない
    if(this.in_action_frame.attack <= 0) return;

    // 攻撃命令を受け付けたその時だけ弓矢を生成
    if(this.in_action_frame.attack == COOL_TIME.attack){
        let arrow = new Arrow(this.x, this.y, this.direction, this.img.arrow);
        this.arrows.push(arrow);
    }

    // 攻撃フレームを 1 進める
    this.in_action_frame.attack--;
}