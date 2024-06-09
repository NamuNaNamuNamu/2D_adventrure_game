// 攻撃判定
// プレイヤーキャラと重なったら、ダメージを与える
// action メソッドから呼び出される

import { is_overlapping_with } from "../../../../z0_common_methods/02_action/is_overlapping_with.js";

export function attack(player, tile_size_in_canvas){
    if(this.is_overlapping_with(player, tile_size_in_canvas)){
        const INVINCIBLE_FRAME = 30;
        player.is_damaged(this.status.atk, INVINCIBLE_FRAME);
    }
}