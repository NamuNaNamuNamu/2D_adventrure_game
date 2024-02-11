/* world_map[5][10] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x5_y10(){
    return {
        map_data: [
            [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
            [30, 30, 0, 2, 0, 2, 0, 2, 0, 2, 5, 2, 0, 2, 0, 30],
            [30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 6, 0, 0, 30],
            [30, 30, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 5, 2, 0, 30],
            [30, 30, 0, 0, 0, 0, 6, 5, 5, 0, 0, 0, 5, 5, 5, 30],
            [30, 30, 0, 2, 0, 2, 5, 2, 5, 2, 0, 2, 0, 2, 5, 30],
            [30, 30, 5, 5, 5, 5, 5, 0, 6, 5, 5, 0, 5, 5, 5, 30],
            [30, 30, 5, 2, 0, 2, 0, 2, 0, 2, 5, 2, 5, 2, 0, 30],
            [30, 30, 5, 5, 6, 0, 0, 0, 0, 0, 6, 5, 5, 0, 0, 30],
            [30, 30, 0, 2, 5, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 30],
            [30, 30, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30],
            [30, 30, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 30],
            [30, 30, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 30],
            [30, 30, 21, 21, 21, 21, 21, 21, 27, 21, 21, 21, 21, 21, 21, 30],
            [30, 30, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 30],
            [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        ],
        enemies: [
            
        ],
    };
}