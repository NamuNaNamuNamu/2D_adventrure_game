// 現在地から進もうとしている方向に進めるかどうか確かめる
// 移動しようとしている方向に、移動できない床がある場合 false を返す
// 移動できる場合は、true を返す

// 1. マップ外にいる場合 (x 座標が 0 以下 もしくは 16 以上、または y 座標が 0 以下 もしくは 16 以上)
//      このメソッドが使われる想定はないのでエラーを返す。
//      このメソッドを使う前に、マップ外にいる場合の処理をして、このメソッドを通らないように制御する必要がある。
// 2. マップ内にいる場合
//      移動しようとしている方向に、移動できない床がある場合 false を返す
//      移動できる場合は、true を返す

import { world_map } from "../../../common_function/world_map.js";

export function check_movability(x, y, world_map_x, world_map_y, direction, map_chip_which_enemy_cannot_move_on){
    const on_the_bottom_edge = y >= FIELD_SIZE_IN_SCREEN;
    const on_the_top_edge = y <= 0;
    const on_the_right_edge = x >= FIELD_SIZE_IN_SCREEN;
    const on_the_left_edge = x <= 0;
    const on_the_outside_of_the_map = (on_the_bottom_edge || on_the_top_edge || on_the_right_edge || on_the_left_edge);

    if(on_the_outside_of_the_map) throw new Error("This method must be used only if it is on the inside the map.");

    const DIRECTION = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    }
    const current_map = world_map()[world_map_x][world_map_y].map_data; // 現在敵キャラが居るマップ
    // const perfectly_on_the_tile_in_x_direction
    // const perfectly_on_the_tile_in_y_direction

    // 上方向に移動しようとしている場合
    if(direction == DIRECTION.up){
        // 敵キャラが上下において、ぴったりタイルの上に乗っている場合、絶対上に一歩進めるので、チェックはスルー
        if(y % 1 == 0.5) return true;
        
        let upper_left = { // 敵キャラの上の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
            x: Math.floor(x - MINIMUM_STEP),
            y: y - 1,
        };
        let upper_right = { // 敵キャラの上の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
            x: Math.ceil(x - MINIMUM_STEP),
            y: y - 1,
        };

        // 敵キャラの半歩上にある床が移動できない場合
        if(
            map_chip_which_enemy_cannot_move_on.includes(current_map[upper_left.y][upper_left.x]) || 
            map_chip_which_enemy_cannot_move_on.includes(current_map[upper_right.y][upper_right.x])
        ){
            return false;
        }
    }
    // 下方向に移動しようとしている場合
    if(direction == DIRECTION.down){
        // 敵キャラが上下において、ぴったりタイルの上に乗っていない場合、絶対下に一歩進めるので、チェックはスルー
        if(y % 1 == 0) return true;

        // もしマップの下端のタイルの上にぴったり乗っている場合、
        // 敵キャラの下にタイルは存在せず、絶対下に一歩進めるので、チェックはスルー
        if(y == FIELD_SIZE_IN_SCREEN - MINIMUM_STEP) return true;

        let lower_left = { // 敵キャラの下の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
            x: Math.floor(x - MINIMUM_STEP),
            y: y + MINIMUM_STEP,
        };
        let lower_right = { // 敵キャラの下の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
            x: Math.ceil(x - MINIMUM_STEP),
            y: y + MINIMUM_STEP,
        };
        
        // 敵キャラの 1歩下にある床が移動できない場合
        if(
            map_chip_which_enemy_cannot_move_on.includes(current_map[lower_left.y][lower_left.x]) || 
            map_chip_which_enemy_cannot_move_on.includes(current_map[lower_right.y][lower_right.x])
        ){
            return false;
        }
    }
    // 左方向に移動しようとしている場合
    if(direction == DIRECTION.left){
        // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対左に一歩進めるので、チェックはスルー
        if(x % 1 == 0) return true;

        let left = { // 敵キャラの左の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真左の床を指す）
            x: x - MINIMUM_STEP - 1,
            y: Math.ceil(y - MINIMUM_STEP),
        };

        // もしマップの下端の場合、参照する床は敵キャラの左の上側にする
        if(y == FIELD_SIZE_IN_SCREEN - MINIMUM_STEP) left.y = y - MINIMUM_STEP;

        // 敵キャラの 1歩左にある床が移動できない場合
        if(map_chip_which_enemy_cannot_move_on.includes(current_map[left.y][left.x])){
            return false;
        }
    }
    // 右方向に移動しようとしている場合
    if(direction == DIRECTION.right){
        // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対右に一歩進めるので、チェックはスルー
        if(x % 1 == 0) return true;

        let right = { // 敵キャラの右の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真右の床を指す）
            x: x + MINIMUM_STEP,
            y: Math.ceil(y - MINIMUM_STEP),
        };

        // もしマップの下端の場合、参照する床は敵キャラの右の上側にする
        if(y == FIELD_SIZE_IN_SCREEN - MINIMUM_STEP) right.y = y - MINIMUM_STEP;

        // 敵キャラの 1歩右にある床が移動できない場合
        if(map_chip_which_enemy_cannot_move_on.includes(current_map[right.y][right.x])){
            return false;
        }
    }
}