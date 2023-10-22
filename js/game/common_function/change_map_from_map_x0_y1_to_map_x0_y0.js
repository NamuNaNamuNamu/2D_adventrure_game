/* マップ[0][1]からラスボスの城のあるマップ[0][0]に行くときの謎解き要素の追加 */

import { delete_one } from "../common_function/delete_one.js";

export function change_map_from_map_x0_y1_to_map_x0_y0(player_world_map_x, player_world_map_y, foot_print){
    // return true ... マップ移動できる
    // return false ... マップ移動できない

    // ワールドマップ[0][1] でなければ関係ない処理なので、return true
    if(!(
        player_world_map_x == 0 &&
        player_world_map_y == 1
    )) return true;

    // ワールドマップ[0][1] なら、プレイヤーキャラの足跡をたどって、移動可能か判断
    // まずは、x 軸方向に 0.5 が含まれる中途半端な足跡は除去する
    let filtered_foot_print = foot_print.filter(function(element){
        return Math.abs(element.x % 1) == 0;
    });

    // y 軸方向には、
    // 上下方向において、ぴったりから上に半歩ずれていた場合も、
    // そのタイルの上に乗っていると判断する。
    for(let element of filtered_foot_print){
        element.y = Math.abs(Math.ceil(element.y));
    }

    // 隣り合ってる重複を消去
    let duplicates = []
    for(let i = 0; i < filtered_foot_print.length - 1; i++){
        if(
            filtered_foot_print[i].x == filtered_foot_print[i + 1].x &&
            filtered_foot_print[i].y == filtered_foot_print[i + 1].y   
        ){
            duplicates.push(i);
        }
    }
    for(let i = duplicates.length - 1; i >= 0; i--){
        delete_one(filtered_foot_print, filtered_foot_print[duplicates[i]]);
    }

    // 決まった道順を通ってマップ移動したかどうかをチェック
    const DETERMINED_PATH = [
        {x: 4, y: 9},
        {x: 4, y: 8},
        {x: 4, y: 7},
        {x: 3, y: 7},
        {x: 2, y: 7},
        {x: 2, y: 6},
        {x: 2, y: 5},
        {x: 3, y: 5},
        {x: 4, y: 5},
        {x: 5, y: 5},
        {x: 6, y: 5},
        {x: 6, y: 4},
        {x: 6, y: 3},
        {x: 7, y: 3},
        {x: 8, y: 3},
        {x: 8, y: 4},
        {x: 8, y: 5},
        {x: 9, y: 5},
        {x: 10, y: 5},
        {x: 10, y: 6},
        {x: 10, y: 7},
        {x: 11, y: 7},
        {x: 12, y: 7},
        {x: 12, y: 6},
        {x: 12, y: 5},
        {x: 13, y: 5},
        {x: 14, y: 5},
        {x: 14, y: 4},
        {x: 14, y: 3},
        {x: 13, y: 3},
        {x: 12, y: 3},
        {x: 12, y: 2},
        {x: 12, y: 1},
        {x: 11, y: 1},
        {x: 10, y: 1},
        {x: 10, y: 0},
    ];
    
    if(filtered_foot_print.length < DETERMINED_PATH.length) return false;
    for(let i = 0; i < DETERMINED_PATH.length; i++){
        if(
            filtered_foot_print[i + (filtered_foot_print.length - DETERMINED_PATH.length)].x != DETERMINED_PATH[i].x ||
            filtered_foot_print[i + (filtered_foot_print.length - DETERMINED_PATH.length)].y != DETERMINED_PATH[i].y
        ) return false;
    }
    return true;
}