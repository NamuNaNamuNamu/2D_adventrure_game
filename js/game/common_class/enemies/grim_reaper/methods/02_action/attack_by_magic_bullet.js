// 魔法弾の攻撃
// action メソッドから呼び出される

// TODO: この説明文を充実させる

import { MagicBullet } from "../../weapon/magic_bullet.js";

const COOL_TIME = { // それぞれの行動のクールタイム
    attack: 2 * FPS,     // 攻撃クールタイム (2 秒は打てない)
}
const MAGIC_BULLET_ATK_COEFFICIENT = 0.5;   // 直接、身体が触れる攻撃を 1 としたときの、魔法弾の攻撃倍率。atk に 掛け算する。

export function attack_by_magic_bullet(player, tile_size_in_canvas){
    // 魔法弾の攻撃判定
    for(let magic_bullet of this.magic_bullets){
        magic_bullet.attack(player, this.status.atk * MAGIC_BULLET_ATK_COEFFICIENT, tile_size_in_canvas);
    }

    // 向いている方向にプレイヤーキャラが通ったら、その方向に弾を発射する
    // まず、プレイヤーキャラのいる位置 から 自分のいる位置を引く
    // TODO: 向いている方向にプレイヤーキャラが通ったら true になるユーティリティメソッドを実装して、それを使うようにしたい。
    let x_diff = player.x - this.x;
    let y_diff = player.y - this.y;
    if(this.in_action_frame.attack <= 0){
        if(
            this.direction == 0 && y_diff < 0 && x_diff == 0 || // 上を向いているとき
            this.direction == 1 && y_diff > 0 && x_diff == 0 || // 下を向いているとき
            this.direction == 2 && x_diff < 0 && y_diff == 0 || // 左を向いているとき
            this.direction == 3 && x_diff > 0 && y_diff == 0    // 右を向いているとき
        ){
            // クールタイムをリセット
            this.in_action_frame.attack = COOL_TIME.attack;

            // 魔法弾を追加
            let magic_bullet = new MagicBullet(this.x, this.y, this.direction, this.img.magic_bullet);
            this.magic_bullets.push(magic_bullet);
        }
    }

    // アクションが終了したら、動作は行わない
    if(this.in_action_frame.attack <= 0) return;

    // 攻撃フレームを 1 進める
    this.in_action_frame.attack--;
}