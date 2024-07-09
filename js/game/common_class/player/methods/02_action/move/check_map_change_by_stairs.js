// 階段でのマップ移動処理
// move メソッドから呼ばれる
// 昇り階段の座標とプレイヤーキャラの
// ワールドマップ上の座標と、マップ上の座標が一致したら、下り階段の座標にワープする
// 下り階段の座標とプレイヤーキャラの
// ワールドマップ上の座標と、マップ上の座標が一致したら、昇り階段の座標にワープする

import { change_map_by_stairs_list } from "../../../../../common_function/change_map_by_stairs_list.js";

export function check_map_change_by_stairs(img, enemies){
    for(let change_map_by_stair of change_map_by_stairs_list()){
        // 昇り階段から下り階段へのワープ
        if(
            this.x == change_map_by_stair.ascending.x + OFFSET &&
            this.y == change_map_by_stair.ascending.y + OFFSET &&
            this.world_map_x == change_map_by_stair.ascending.world_map_x &&
            this.world_map_y == change_map_by_stair.ascending.world_map_y
        ){
            this.x = change_map_by_stair.descending.x + OFFSET;
            this.y = change_map_by_stair.descending.y + OFFSET;
            this.world_map_x = change_map_by_stair.descending.world_map_x;
            this.world_map_y = change_map_by_stair.descending.world_map_y;
            this.execute_common_process_by_map_change(img, enemies);
        }
        // 下り階段から昇り階段へのワープ
        else if(
            this.x == change_map_by_stair.descending.x + OFFSET &&
            this.y == change_map_by_stair.descending.y + OFFSET &&
            this.world_map_x == change_map_by_stair.descending.world_map_x &&
            this.world_map_y == change_map_by_stair.descending.world_map_y
        ){
            this.x = change_map_by_stair.ascending.x + OFFSET;
            this.y = change_map_by_stair.ascending.y + OFFSET;
            this.world_map_x = change_map_by_stair.ascending.world_map_x;
            this.world_map_y = change_map_by_stair.ascending.world_map_y;
            this.execute_common_process_by_map_change(img, enemies);
        }
    }
}