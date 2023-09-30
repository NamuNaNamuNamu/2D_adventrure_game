/* ワールドマップを定義する関数 */

import { map_x00_y00 } from "./world_map_parts/map_x00_y00.js";
import { map_x00_y01 } from "./world_map_parts/map_x00_y01.js";
import { map_x00_y02 } from "./world_map_parts/map_x00_y02.js";
import { map_x01_y00 } from "./world_map_parts/map_x01_y00.js";
import { map_x01_y01 } from "./world_map_parts/map_x01_y01.js";
import { map_x01_y02 } from "./world_map_parts/map_x01_y02.js";
import { map_x02_y00 } from "./world_map_parts/map_x02_y00.js";
import { map_x02_y01 } from "./world_map_parts/map_x02_y01.js";
import { map_x02_y02 } from "./world_map_parts/map_x02_y02.js";

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
        [map_x00_y00(), map_x01_y00(), map_x02_y00()],
        [map_x00_y01(), map_x01_y01(), map_x02_y01()],
        [map_x00_y02(), map_x01_y02(), map_x02_y02()],
    ];
}