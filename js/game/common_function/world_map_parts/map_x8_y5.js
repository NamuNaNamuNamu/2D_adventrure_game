/* world_map[8][5] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x8_y5(){
    return {
        map_data: [
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            [7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7],
            [7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7],
            [7, 7, 5, 5, 8, 8, 5, 5, 5, 5, 8, 8, 5, 5, 7, 7],
            [7, 7, 5, 5, 8, 41, 41, 41, 41, 41, 41, 8, 5, 5, 7, 7],
            [7, 7, 5, 5, 5, 41, 41, 41, 41, 41, 41, 5, 5, 5, 7, 7],
            [7, 7, 5, 5, 5, 41, 41, 41, 41, 41, 41, 5, 5, 5, 7, 7],
            [7, 7, 5, 5, 8, 41, 41, 41, 41, 41, 41, 8, 5, 5, 7, 7],
            [7, 7, 5, 5, 8, 8, 5, 5, 5, 5, 8, 8, 5, 5, 7, 7],
            [7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7],
            [7, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 7],
            [7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7],
            [7, 7, 7, 7, 7, 7, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7],
        ],
        enemies: [
            
        ],
    };
}