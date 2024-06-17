// マップ移動の際に行われる共通処理
// - 弓矢の消去
// - 足跡の消去
// - 移動前のマップの敵の全消去
// - 移動先のマップの敵の生成

import { generate_enemies } from "../../../../../../common_function/generate_enemies.js";

export function execute_common_process_by_map_change(img, enemies){
    this.arrows.delete_all();
    this.foot_print.delete_all();
    enemies.delete_all();
    generate_enemies(this.world_map_x, this.world_map_y, img, enemies);
}