/* world_map[6][7] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x6_y7(){
    return {
        map_data: [
            [13, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 13],
            [10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [10, 10, 11, 12, 11, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10],
            [10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 11, 12, 11, 10],
            [10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 10, 10, 10, 11, 10, 10],
            [10, 10, 10, 10, 10, 2, 0, 0, 0, 0, 2, 10, 10, 10, 10, 10],
            [10, 10, 10, 10, 0, 0, 1, 40, 40, 1, 0, 0, 10, 10, 10, 10],
            [10, 10, 10, 10, 0, 0, 40, 40, 40, 40, 0, 0, 10, 10, 10, 10],
            [10, 10, 10, 10, 0, 0, 40, 40, 40, 40, 0, 0, 10, 10, 10, 10],
            [10, 10, 10, 10, 10, 0, 1, 40, 40, 1, 0, 10, 10, 10, 10, 10],
            [10, 10, 10, 10, 10, 2, 0, 0, 0, 0, 2, 10, 10, 10, 10, 10],
            [10, 10, 11, 10, 10, 10, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10],
            [10, 11, 12, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 13],
            [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 14, 14, 13],
            [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
        ],
        enemies: [
            
        ],
    };
}