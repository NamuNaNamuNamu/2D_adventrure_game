// 進もうとしている方向に進めるかどうか確かめる
// control メソッド から呼び出される
// is_blown_away メソッド からも呼び出される
// 移動しようとしている方向に、移動できない床がある場合 false を返す
// 移動できる場合は、true を返す

import { world_map } from "./../../../../../common_function/world_map.js";

export function check_movability(direction){
    let current_map = world_map()[this.world_map_x][this.world_map_y].map_data; // 現在敵キャラが居るマップ
    let enemy_x = this.x - OFFSET; // 敵キャラの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
    let enemy_y = this.y - OFFSET; // 敵キャラの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0

    // 上方向に移動しようとしている場合
    if(direction == 0){
        // 敵キャラが上下において、ぴったりタイルの上に乗っている場合、絶対上に一歩進めるので、チェックはスルー
        if(enemy_y % 1 == 0) return true;

        // もしマップの上端の場合、絶対上に一歩進めるので、チェックはスルー
        if(enemy_y <= 0) return true;
        
        let upper_left = { // 敵キャラの上の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
            x: Math.floor(enemy_x),
            y: enemy_y - 0.5,
        };
        let upper_right = { // 敵キャラの上の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
            x: Math.ceil(enemy_x),
            y: enemy_y - 0.5,
        };

        // 敵キャラの半歩上にある床が移動できない場合
        if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[upper_left.y][upper_left.x]) || 
        this.map_chip_which_enemy_cannot_move_on.includes(current_map[upper_right.y][upper_right.x])){
            return false;
        }
    }
    // 下方向に移動しようとしている場合
    if(direction == 1){
        // 敵キャラが上下において、ぴったりタイルの上に乗っていない場合、絶対下に一歩進めるので、チェックはスルー
        if(Math.abs((enemy_y) % 1) == 0.5) return true; // NOTE: -0.5 % 1 は 0.5 ではなく、-0.5 となってしまうので、絶対値を取って回避。

        // もしマップの下端の場合、絶対下に一歩進めるので、チェックはスルー
        if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) return true;

        let lower_left = { // 敵キャラの下の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
            x: Math.floor(enemy_x),
            y: enemy_y + 1,
        };
        let lower_right = { // 敵キャラの下の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
            x: Math.ceil(enemy_x),
            y: enemy_y + 1,
        };
        
        // 敵キャラの 1歩下にある床が移動できない場合
        if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[lower_left.y][lower_left.x]) || 
        this.map_chip_which_enemy_cannot_move_on.includes(current_map[lower_right.y][lower_right.x])){
            return false;
        }
    }
    // 左方向に移動しようとしている場合
    if(direction == 2){
        // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対左に一歩進めるので、チェックはスルー
        if((enemy_x) % 1 == 0.5) return true;

        let left = { // 敵キャラの左の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真左の床を指す）
            x: enemy_x - 1,
            y: Math.ceil(enemy_y),
        };

        // もしマップの下端の場合、参照する床は敵キャラの左の上側にする
        if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) left.y = Math.floor(enemy_y);

        // 敵キャラの 1歩左にある床が移動できない場合
        if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[left.y][left.x])){
            return false;
        }
    }
    // 右方向に移動しようとしている場合
    if(direction == 3){
        // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対右に一歩進めるので、チェックはスルー
        if((enemy_x) % 1 == 0.5) return true;

        let right = { // 敵キャラの右の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真右の床を指す）
            x: enemy_x + 1,
            y: Math.ceil(enemy_y),
        };

        // もしマップの下端の場合、参照する床は敵キャラの右の上側にする
        if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) right.y = Math.floor(enemy_y);

        // 敵キャラの 1歩右にある床が移動できない場合
        if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[right.y][right.x])){
            return false;
        }
    }
}