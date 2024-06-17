// ダメージを受ける処理。
// NOTE: ダメージ発生時に敵クラスから呼び出す

export function is_damaged(damage, frame){
    // もし、無敵時間中なら、ダメージは発生しない
    if(this.in_action_frame.damaged > 0) return;

    // HP を ダメージ数分減らす
    this.status.hp -= damage;

    // 死亡判定
    // ダメージを受けた結果、HP が 0 になったら、ゲームオーバー処理
    if(this.status.hp <= 0){
        this.status.hp = 0;                    // HP が マイナスの値にならないように、0に調整。
        console.log("ゲームオーバー");
    }

    // 無敵時間を付与
    this.in_action_frame.damaged = frame;
}