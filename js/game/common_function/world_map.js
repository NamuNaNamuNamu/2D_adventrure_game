/* ワールドマップを定義する関数 */

import { map_x0_y0 } from "./world_map_parts/map_x0_y0.js";
import { map_x0_y1 } from "./world_map_parts/map_x0_y1.js";
import { map_x0_y2 } from "./world_map_parts/map_x0_y2.js";
import { map_x1_y0 } from "./world_map_parts/map_x1_y0.js";
import { map_x1_y1 } from "./world_map_parts/map_x1_y1.js";
import { map_x1_y2 } from "./world_map_parts/map_x1_y2.js";
import { map_x2_y0 } from "./world_map_parts/map_x2_y0.js";
import { map_x2_y1 } from "./world_map_parts/map_x2_y1.js";
import { map_x2_y2 } from "./world_map_parts/map_x2_y2.js";

export function world_map(){
    /*
    TODO: あとで、本番用マップに変える
    とりあえず仮で 3 × 3 のマップを作成
    一番左上: [0][0]
    一番左下: [0][2]
    一番右上: [2][0]
    一番右下: [2][2]
    */
    return [
        [map_x0_y0(), map_x1_y0(), map_x2_y0()],
        [map_x0_y1(), map_x1_y1(), map_x2_y1()],
        [map_x0_y2(), map_x1_y2(), map_x2_y2()],
    ];
}