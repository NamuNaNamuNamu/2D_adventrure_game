// 被ダメージ処理
// ダメージを受けたらプレイヤーキャラを点滅させる
// action メソッドから呼び出される

import { COLOR } from "../../player.js";

export function damaged(){
    // 無敵時間が終了したら、無敵時間経過は行わない
    if(this.in_action_frame.damaged <= 0) return;

    // 被ダメージフレームを 1 進める
    this.in_action_frame.damaged--;

    // in_action_frame.damaged が 2 フレーム進むごとに、色をオレンジと青で交互に変える
    // 0 フレーム ... 青
    // 1 ~ 2  フレーム ... オレンジ
    // 3 ~ 4  フレーム ... 青
    // 5 ~ 6  フレーム ... オレンジ
    // 7 ~ 8 フレーム ... 青
    // ...
    const CHANGE_COLOR_FRAME = 2;   // 何フレームごとに色を変えるか
    if(Math.ceil(this.in_action_frame.damaged / CHANGE_COLOR_FRAME) % 2 == 0) this.color = COLOR.blue;
    if(Math.ceil(this.in_action_frame.damaged / CHANGE_COLOR_FRAME) % 2 == 1) this.color = COLOR.orange;
}
