/* world_map[0][0] を定義する関数 */

import { enemy_species } from "../enemy_species.js";

export function map_x0_y0(){
    /*
    0 ... 草原
    1 ... 砂原
    2 ... 海
    3 ... 洞窟の床？みたいな
    4 ... 剣のマークの看板
    5 ... 昇り階段
    6 ... 花つき草原
    7 ... 扉
    8 ... 木
    9 ... 岩
    10 ... テーブル
    11 ... 石レンガ
    12 ... 宝箱(未開封)
    13 ... 宝箱(開封済み)
    14 ... 草つき草原
    15 ... 石レンガ(壁)
    */

    return {
        map_data: [
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 9, 6, 6, 6, 6],
            [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 9, 6, 6, 6, 6],
            [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 9, 9, 6, 9],
            [2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 6, 0, 0, 0, 0, 0],
            [2, 2, 2, 2, 1, 1, 1, 1, 0, 6, 0, 0, 6, 0, 6, 0],
            [2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
            [2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 1, 0, 0, 0, 0, 0, 0, 11, 11, 11, 11, 11, 11, 11],
            [2, 1, 1, 0, 0, 0, 6, 0, 0, 11, 15, 15, 15, 15, 15, 15],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 11, 3, 5, 3, 13, 3, 12],
            [0, 0, 0, 0, 6, 6, 0, 0, 0, 11, 3, 3, 3, 3, 3, 3],
            [8, 8, 8, 0, 0, 0, 0, 0, 0, 15, 15, 7, 15, 15, 15, 15],
            [8, 14, 14, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 14, 14, 8],
            [8, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
        ],
        enemies: [
            {
                species_id: enemy_species().slime.id,            // 敵の種類
                x: 4 + OFFSET,                                   // 初期 x 座標(配列のインデックスになるように調整)
                y: 4 + OFFSET,                                   // 初期 y 座標(配列のインデックスになるように調整)
            },
        ],
    };
}