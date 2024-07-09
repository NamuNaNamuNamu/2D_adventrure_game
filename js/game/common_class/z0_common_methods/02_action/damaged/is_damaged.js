// ダメージを受ける処理。
// NOTE: ダメージ発生時に damaged メソッドから呼び出される

const DAMAGED_COOL_TIME = 8; // 被ダメージのクールタイム (現時点では、身体の色がダメージを受けている時の色になる時間)

export function is_damaged(damage, enemies, arrow, arrows){
    // HP を ダメージ数分減らす
    this.status.hp -= damage;
    // 被ダメージフレームをリセットする (プレイヤーキャラと違って無敵時間は付与しない)
    this.in_action_frame.damaged = DAMAGED_COOL_TIME;
    // 当たった弓矢を消去
    arrows.splice(arrows.indexOf(arrow), 1);

    // 死亡判定
    // ダメージを受けた結果、HP が 0 になったら、自分を消滅させる。
    if(this.status.hp <= 0){
        enemies.delete(this);
        return;
    }
}