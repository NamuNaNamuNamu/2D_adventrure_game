// 敵キャラの移動処理
// 1. MOVE_COOL_TIME ごとに、アニメーションを動かす
// 2. MOVE_COOL_TIME ごとに、以下の挙動をする。
//     2-1. is_taking_a_break が true の場合、動かない
//     2-2. is_taking_a_break が false の場合、direction の方向 (0: 上, 1: 下, 2: 左, 3: 右) に動く

export function move(animation_order){
    // アクションが終了したら、動作は行わない (次の動作命令に向けて待機)
    if(this.in_action_frame.move <= 0) return;

    // 休憩じゃなければ移動する
    if(this.direction == 0 && !this.is_taking_a_break) this.y = Math.round((this.y - MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
    if(this.direction == 1 && !this.is_taking_a_break) this.y = Math.round((this.y + MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
    if(this.direction == 2 && !this.is_taking_a_break) this.x = Math.round((this.x - MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
    if(this.direction == 3 && !this.is_taking_a_break) this.x = Math.round((this.x + MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
    
    // 動作フレームを 1 進める
    this.in_action_frame.move--;

    // MOVE_COOL_TIME に 1回 (in_action_frame.move が 0 になったとき) だけ、
    if(this.in_action_frame.move > 0) return;

    // 座標の誤差を補正する
    this.x = Math.round(this.x * 2) * 0.5;
    this.y = Math.round(this.y * 2) * 0.5;

    // アニメーションを動かす
    const NUM_OF_ANIMATION_FLAME = animation_order.length;      // アニメーションの数
    this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす

    // 休み状態を解消
    this.is_taking_a_break = false;
}