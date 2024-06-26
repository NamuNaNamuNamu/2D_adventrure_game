/* world_map[6][6] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x6_y6(){
    return {
        map_data: [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [2, 0, 1, 40, 40, 40, 40, 40, 40, 40, 40, 1, 0, 0, 0, 0],
            [2, 0, 0, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0],
            [2, 0, 0, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0],
            [2, 0, 1, 40, 40, 40, 40, 40, 40, 40, 40, 1, 0, 0, 0, 0],
            [2, 0, 0, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0],
            [2, 0, 0, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0],
            [2, 0, 1, 40, 40, 40, 40, 40, 40, 40, 40, 1, 0, 0, 0, 0],
            [2, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 10, 10, 10, 10, 10, 0, 0, 10, 10, 10, 10, 10, 0, 2],
        ],
        enemies: [
            
        ],
    };
}