// ダメージを受けたときに吹っ飛ばされる処理
// ただし、以下の場合は例外。
// 1. マップ外に出るように吹っ飛ばされた場合、何も起きない
// 2. 移動中の場合、何も起きない
// 3. 吹っ飛ばされる方向が移動できない床だった場合、何も起きない
// is_damaged メソッドから呼ばれる

import { check_movability } from "../../check_movability.js";

export function is_blown_away(arrow, map_chip_which_enemy_cannot_move_on){
    // 1. マップ外に出るように吹っ飛ばされた場合、何も起きない
    if(this.x <= 0 && arrow.direction == 2 ||
    this.x >= FIELD_SIZE_IN_SCREEN && arrow.direction == 3 ||
    this.y <= 0 && arrow.direction == 0 ||
    this.y >= FIELD_SIZE_IN_SCREEN && arrow.direction == 1){
        return;
    }

    // 2. 移動中の場合、何も起きない
    if(this.in_action_frame.move != 0 && !(this.is_taking_a_break)) return;

    // 3. 吹っ飛ばされる方向が移動できない床だった場合、何も起きない
    if(check_movability(this.x, this.y, this.world_map_x, this.world_map_y, arrow.direction, map_chip_which_enemy_cannot_move_on) == false) return;

    // 吹っ飛ばされる (MINIMUM_STEP 分)
    if(arrow.direction == 0) this.y -= MINIMUM_STEP;
    if(arrow.direction == 1) this.y += MINIMUM_STEP;
    if(arrow.direction == 2) this.x -= MINIMUM_STEP;
    if(arrow.direction == 3) this.x += MINIMUM_STEP;
}