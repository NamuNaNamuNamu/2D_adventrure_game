// 現在地から進もうとしている方向に進めるかどうか確かめる

// <前提処理>
// 1. 前提として、x 座標、y 座標が 0.5 の倍数である必要がある。
//      0.5 の倍数でない場合、エラーを返す。
//      このメソッドを使う前に丸めこむ必要がある。
// 2. マップ外にいる場合 (x 座標が 0 未満 もしくは 16 より大きい、または y 座標が 0 未満 もしくは 16 より大きい)
//      このメソッドが使われる想定はないのでエラーを返す。
//      このメソッドを使う前に、マップ外にいる場合の処理をして、このメソッドを通らないように制御する必要がある。
//
// <本処理>
// 3. マップ内にいる場合
//      移動しようとしている方向に、移動できない床がある場合 false を返す
//      移動できる場合は、true を返す

import { world_map } from "../../common_function/world_map.js";

export function check_movability(x, y, world_map_x, world_map_y, direction, map_chip_which_enemy_cannot_move_on){
    // <前提処理>
    if(x % 0.5 != 0) throw new Error("x value is illegal. it must be multiple of 0.5. ex) 0.5, 1.0, 1.5, 2.0, 2.5 ...");
    if(y % 0.5 != 0) throw new Error("y value is illegal. it must be multiple of 0.5. ex) 0.5, 1.0, 1.5, 2.0, 2.5 ...");

    const outside_of_the_top_edge = y < 0;
    const outside_of_the_bottom_edge = y > FIELD_SIZE_IN_SCREEN;
    const outside_of_the_left_edge = x < 0;
    const outside_of_the_right_edge = x > FIELD_SIZE_IN_SCREEN;
    const on_the_outside_of_the_map = (outside_of_the_top_edge || outside_of_the_bottom_edge || outside_of_the_left_edge || outside_of_the_right_edge);

    if(on_the_outside_of_the_map) throw new Error("This method must be used only if it is on the inside the map.");

    // <本処理>
    const perfectly_on_the_tile_in_x_direction = x % 1 == 0.5;                              // キャラが左右において、ぴったりタイルの上に乗っている
    const not_perfectly_on_the_tile_in_x_direction = !perfectly_on_the_tile_in_x_direction; // キャラが左右において、ぴったりタイルの上に乗っていない
    const perfectly_on_the_tile_in_y_direction = y % 1 == 0.5;                              // キャラが上下において、ぴったりタイルの上に乗っている
    const not_perfectly_on_the_tile_in_y_direction = !perfectly_on_the_tile_in_y_direction; // キャラが上下において、ぴったりタイルの上に乗っていない

    const on_the_top_edge = y == 0;                                                         // マップの上端にいる
    const on_the_bottom_edge = y == FIELD_SIZE_IN_SCREEN;                                   // マップの下端にいる
    const on_the_left_edge = x == 0;                                                        // マップの左端にいる
    const on_the_right_edge = x == FIELD_SIZE_IN_SCREEN;                                    // マップの右端にいる

    const on_the_bottom_edge_tile = y == FIELD_SIZE_IN_SCREEN - MINIMUM_STEP;               // マップの下端のタイルの上にぴったり乗っている
    const on_the_left_edge_tile = x == 0 + MINIMUM_STEP;
    const on_the_right_edge_tile = x == FIELD_SIZE_IN_SCREEN - MINIMUM_STEP;

    const DIRECTION = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    }
    const current_map = world_map()[world_map_x][world_map_y].map_data; // 現在キャラが居るマップ

    // 上方向に移動しようとしている場合
    if(direction == DIRECTION.up){
        // NOTE: 絶対上に 1 歩進めるので、チェックはスルー
        if(perfectly_on_the_tile_in_y_direction) return true;
        if(on_the_top_edge) return true;
        
        let upper_left = { // キャラの上の左側にある床（キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
            x: Math.floor(x - MINIMUM_STEP),
            y: y - 1,
        };
        let upper_right = { // キャラの上の右側にある床（キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
            x: Math.ceil(x - MINIMUM_STEP),
            y: y - 1,
        };
        
        // NOTE: 左端の場合、左上に壁はないので参照しない。右端の場合、右上に壁がないので参照しない。
        const bumped_into_upper_left = on_the_left_edge ? false : map_chip_which_enemy_cannot_move_on.includes(current_map[upper_left.y][upper_left.x]);
        const bumped_into_upper_right = on_the_right_edge ? false : map_chip_which_enemy_cannot_move_on.includes(current_map[upper_right.y][upper_right.x]);

        // キャラの半歩上にある床が移動できない場合、false
        if(bumped_into_upper_left || bumped_into_upper_right) return false;
    }
    // 下方向に移動しようとしている場合
    if(direction == DIRECTION.down){
        // NOTE: 絶対下に 1 歩進めるので、チェックはスルー
        if(not_perfectly_on_the_tile_in_y_direction) return true;
        if(on_the_bottom_edge_tile) return true;

        let lower_left = { // キャラの下の左側にある床（キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
            x: Math.floor(x - MINIMUM_STEP),
            y: y + MINIMUM_STEP,
        };
        let lower_right = { // キャラの下の右側にある床（キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
            x: Math.ceil(x - MINIMUM_STEP),
            y: y + MINIMUM_STEP,
        };

        // NOTE: 左端の場合、左上に壁はないので参照しない。右端の場合、右上に壁がないので参照しない。
        const bumped_into_lower_left = on_the_left_edge ? false : map_chip_which_enemy_cannot_move_on.includes(current_map[lower_left.y][lower_left.x]);
        const bumped_into_lower_right = on_the_right_edge ? false : map_chip_which_enemy_cannot_move_on.includes(current_map[lower_right.y][lower_right.x]);
        
        // キャラの 1 歩下にある床が移動できない場合、false
        if(bumped_into_lower_left || bumped_into_lower_right) return false;
    }
    // 左方向に移動しようとしている場合
    if(direction == DIRECTION.left){
        // NOTE: 絶対左に 1 歩進めるので、チェックはスルー
        if(not_perfectly_on_the_tile_in_x_direction) return true;
        if(on_the_left_edge_tile) return true;

        let left = { // キャラの左の下側にある床（キャラが上下において、ぴったりタイルの上に乗っている場合、真左の床を指す）
            x: x - MINIMUM_STEP - 1,
            y: Math.ceil(y - MINIMUM_STEP),
        };

        // もしマップの下端の場合、参照する床はキャラの左の上側にする
        if(on_the_bottom_edge) left.y = y - 1;

        // キャラの 1 歩左にある床が移動できない場合、false
        const bumped_into_left = map_chip_which_enemy_cannot_move_on.includes(current_map[left.y][left.x]);
        if(bumped_into_left) return false;
    }
    // 右方向に移動しようとしている場合
    if(direction == DIRECTION.right){
        // NOTE: 絶対右に 1 歩進めるので、チェックはスルー
        if(not_perfectly_on_the_tile_in_x_direction) return true;
        if(on_the_right_edge_tile) return true;

        let right = { // キャラの右の下側にある床（キャラが上下において、ぴったりタイルの上に乗っている場合、真右の床を指す）
            x: x + MINIMUM_STEP,
            y: Math.ceil(y - MINIMUM_STEP),
        };

        // もしマップの下端の場合、参照する床は敵キャラの右の上側にする
        if(on_the_bottom_edge) right.y = y - 1;

        // キャラの 1 歩右にある床が移動できない場合、false
        const bumped_into_right = map_chip_which_enemy_cannot_move_on.includes(current_map[right.y][right.x]);
        if(bumped_into_right) return false;
    }

    return true;
}