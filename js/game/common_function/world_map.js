/* ワールドマップを定義する関数 */

import { map_x0_y0 } from "./world_map_parts/map_x0_y0.js";
import { map_x0_y1 } from "./world_map_parts/map_x0_y1.js";
import { map_x0_y2 } from "./world_map_parts/map_x0_y2.js";
import { map_x0_y3 } from "./world_map_parts/map_x0_y3.js";
import { map_x1_y0 } from "./world_map_parts/map_x1_y0.js";
import { map_x1_y1 } from "./world_map_parts/map_x1_y1.js";
import { map_x1_y2 } from "./world_map_parts/map_x1_y2.js";
import { map_x1_y3 } from "./world_map_parts/map_x1_y3.js";
import { map_x2_y0 } from "./world_map_parts/map_x2_y0.js";
import { map_x2_y1 } from "./world_map_parts/map_x2_y1.js";
import { map_x2_y2 } from "./world_map_parts/map_x2_y2.js";
import { map_x2_y3 } from "./world_map_parts/map_x2_y3.js";

export function world_map(){
    /*
    縦 15 × 横 10 のマップを作成
    ただし、以下のように分かれる
    - 上の 10 × 10 がメインマップ
        - 一番左上: [0][0] ... ラスボスの城があるマップ
        - 一番左下: [0][9]
        - 一番右上: [9][0]
        - 一番右下: [9][9]
    - 下の 5 × 5 は ラスボス城の中のマップ
        - 一番左上: [0][10]
        - 一番左下: [0][14]
        - 一番右上: [4][10]
        - 一番右下: [4][14]
    - [5][10] のみ、ラスボスへの道のヒントを与えるマップ
    */
    return [
        [map_x0_y0(), map_x0_y1(), map_x0_y2(), map_x0_y3()],
        [map_x1_y0(), map_x1_y1(), map_x1_y2(), map_x1_y3()],
        [map_x2_y0(), map_x2_y1(), map_x2_y2(), map_x2_y3()],
    ];
}