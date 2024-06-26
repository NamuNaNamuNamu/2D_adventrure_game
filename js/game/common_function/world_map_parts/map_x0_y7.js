/* world_map[0][7] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x0_y7(){
    return {
        map_data: [
            [33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
            [33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
            [33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 34],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 34],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 33],
            [33, 33, 21, 21, 21, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
            [33, 34, 21, 21, 21, 34, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
            [33, 34, 21, 21, 21, 34, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33],
        ],
        enemies: [
            {
                species_id: enemy_species().black_dragon.id,     // 敵の種類
                x: 13.5 + OFFSET,                                  // 初期 x 座標(配列のインデックスになるように調整)
                y: 7.5 + OFFSET,                                   // 初期 y 座標(配列のインデックスになるように調整)
            },
        ],
    };
}