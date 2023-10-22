/* world_map[1][1] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x1_y1(){
    return {
        map_data: [
            [38, 24, 24, 24, 24, 24, 24, 24, 37, 37, 37, 37, 37, 37, 37, 37],
            [38, 24, 24, 24, 24, 24, 24, 24, 37, 37, 37, 37, 37, 37, 37, 37],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 37, 37, 37, 37, 37, 37, 37, 37],
            [38, 24, 24, 24, 24, 24, 24, 24, 37, 37, 37, 37, 37, 37, 37, 37],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
            [38, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 37, 37],
            [38, 24, 24, 24, 24, 24, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37],
        ],
        enemies: [
            {
                species_id: enemy_species().grim_reaper.id,      // 敵の種類
                x: 7 + OFFSET,                                   // 初期 x 座標(配列のインデックスになるように調整)
                y: 7 + OFFSET,                                   // 初期 y 座標(配列のインデックスになるように調整)
            },
        ],
    };
}