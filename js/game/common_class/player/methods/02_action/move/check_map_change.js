// マップ移動処理
// move メソッドから呼ばれる

import { change_map_from_map_x0_y1_to_map_x0_y0 } from "./check_map_change/change_map_from_map_x0_y1_to_map_x0_y0.js";

export function check_map_change(img, enemies){
    if(this.x < 0){
        this.x += FIELD_SIZE_IN_SCREEN;
        this.world_map_x--;
        this.execute_common_process_by_map_change(img, enemies);
    }
    if(this.x > FIELD_SIZE_IN_SCREEN){
        this.x -= FIELD_SIZE_IN_SCREEN;
        this.world_map_x++;
        this.execute_common_process_by_map_change(img, enemies);
    }
    if(this.y < 0){
        this.y += FIELD_SIZE_IN_SCREEN;
        if(change_map_from_map_x0_y1_to_map_x0_y0(this.world_map_x, this.world_map_y, this.foot_print) == false) return; // マップ[0][1] から ラスボスの城のあるマップ[0][0]に行くときの謎要素の追加
        this.world_map_y--;
        this.execute_common_process_by_map_change(img, enemies);
    }
    if(this.y > FIELD_SIZE_IN_SCREEN){
        this.y -= FIELD_SIZE_IN_SCREEN;
        this.world_map_y++;
        this.execute_common_process_by_map_change(img, enemies);
    }
}