/* world_map[0][1] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x0_y1(){
    return {
        map_data: [
            [40, 40, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3],
            [40, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3],
            [40, 40, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3],
            [40, 40, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3],
            [40, 40, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3],
            [40, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3],
            [40, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3],
            [40, 40, 10, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 40, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 40, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
            [40, 40, 40, 40, 10, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3],
            [40, 40, 40, 40, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
        ],
        enemies: [
            {
                species_id: enemy_species().slime.id,            // 敵の種類
                x: 6 + OFFSET,                                   // 初期 x 座標(配列のインデックスになるように調整)
                y: 3 + OFFSET,                                   // 初期 y 座標(配列のインデックスになるように調整)
            },
            {
                species_id: enemy_species().slime.id,            // 敵の種類
                x: 10 + OFFSET,                                   // 初期 x 座標(配列のインデックスになるように調整)
                y: 5 + OFFSET,                                   // 初期 y 座標(配列のインデックスになるように調整)
            },
        ],
    };
}