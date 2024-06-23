// 弓矢とプレイヤーキャラを実際に動かす。
// 弓矢は問答無用で動くが、プレイヤーキャラは、in_action_frame.move が 1 以上のときに移動する
// action メソッドから呼び出される

const PLAYER_SPEED_COEFFICIENT = 0.33;    // プレイヤーのスピードの係数

export function move(img, enemies){
    // 弓矢を動かす
    for(let arrow of this.arrows){
        arrow.move(this.arrows);
    }

    // アクションが終了したら、プレイヤーの動作は行わない (次の動作命令に向けて待機)
    if(this.in_action_frame.move <= 0) return;

    // キー入力に応じて移動させる
    if(this.direction == 0) this.y = Math.round((this.y - MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
    if(this.direction == 1) this.y = Math.round((this.y + MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
    if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
    if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;

    // 動作フレームを 1 進める
    this.in_action_frame.move--;
    // 動作しきったタイミングで、
    if(this.in_action_frame.move == 0){
        // 座標の誤差を補正する
        this.x = Math.round(this.x * 2) * 0.5;
        this.y = Math.round(this.y * 2) * 0.5;
        // 足跡を追加する
        this.add_foot_print();
        // アニメーションを 1 動かす(0 なら 1 に。1 なら 0 に)
        this.animation_frame = (this.animation_frame + 1) % 2;
    }

    // マップ移動処理
    this.check_map_change(img, enemies);

    // 階段でのマップ移動処理
    this.check_map_change_by_stairs(img, enemies);
}