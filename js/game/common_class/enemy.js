/* 敵キャラ全てが継承する大元クラス */

import { world_map } from "./../common_function/world_map.js";

export class Enemy{
    constructor(x, y, world_map_x, world_map_y, width, height, img, hp, atk){
        this.x = x;                         // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 敵キャラの画像の中心の座標とする
        this.y = y;                         // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 敵キャラの画像の中心の座標とする
        this.world_map_x = world_map_x;     // その敵キャラが生息する ワールドマップの x 座標
        this.world_map_y = world_map_y;     // その敵キャラが生息する ワールドマップの y 座標
        this.width = width;                 // 敵キャラの横幅 (タイル基準 = 1 がタイル1枚分)
        this.height = height;               // 敵キャラの縦幅 (タイル基準 = 1 がタイル1枚分)
        this.img = img;                     // 写真
        this.direction = 0;                 // 身体の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.animation_frame = 0;           // 写真のアニメーション (0 と 1 と 2 と 3 を 交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                        // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
        };
        this.is_taking_a_break = false;     // 行動しない状態
        this.hp = hp;                       // HP
        this.atk = atk;                     // 攻撃力 // NOTE: 難易度によってここを変動させるかも？
    }

    // 進もうとしている方向に進めるかどうか確かめる
    // 1. マップの端に行ったら、マップ外に出ないように戻る
    // 2. 移動しようとしている方向に、移動できない床がある場合に
    //    in_action_frame.move を 0 にすることで、移動を中止する 
    check_movability(map_chip_which_enemy_cannot_move_on){
        // 現在敵キャラが居るマップ
        let current_map = world_map()[this.world_map_y][this.world_map_x].map_data;
        let enemy_x = this.x - 0.5; // 敵キャラの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
        let enemy_y = this.y - 0.5; // 敵キャラの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0

        // マップ移動しようとしたら、マップ内に居座るように戻る
        if(this.x <= 0){                    // 左にはみ出ようとしたら
            this.direction = 3;             // 右に戻る
            return;
        }
        if(this.x >= FIELD_SIZE_IN_SCREEN){ // 右にはみ出ようとしたら
            this.direction = 2;             // 左に戻る
            return;
        }
        if(this.y <= 0){                    // 上にはみ出ようとしたら
            this.direction = 1;             // 下に戻る
            return;
        }
        if(this.y >= FIELD_SIZE_IN_SCREEN){ // 下にはみ出ようとしたら
            this.direction = 0;             // 上に戻る
            return;
        }

        // 上方向に移動しようとしている場合
        if(this.direction == 0){
            // 敵キャラが上下において、ぴったりタイルの上に乗っている場合、絶対上に一歩進めるので、チェックはスルー
            if(enemy_y % 1 == 0) return;

            // もしマップの上端の場合、絶対上に一歩進めるので、チェックはスルー
            if(enemy_y <= 0) return;
            
            let upper_left = { // 敵キャラの上の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
                x: Math.floor(enemy_x),
                y: enemy_y - 0.5,
            };
            let upper_right = { // 敵キャラの上の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
                x: Math.ceil(enemy_x),
                y: enemy_y - 0.5,
            };

            // 敵キャラの半歩上にある床が移動できない場合
            if(map_chip_which_enemy_cannot_move_on.includes(current_map[upper_left.y][upper_left.x]) || 
            map_chip_which_enemy_cannot_move_on.includes(current_map[upper_right.y][upper_right.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
        // 下方向に移動しようとしている場合
        if(this.direction == 1){
            // 敵キャラが上下において、ぴったりタイルの上に乗っていない場合、絶対下に一歩進めるので、チェックはスルー
            if(Math.abs((enemy_y) % 1) == 0.5) return; // NOTE: -0.5 % 1 は 0.5 ではなく、-0.5 となってしまうので、絶対値を取って回避。

            // もしマップの下端の場合、絶対下に一歩進めるので、チェックはスルー
            if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) return;

            let lower_left = { // 敵キャラの下の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
                x: Math.floor(enemy_x),
                y: enemy_y + 1,
            };
            let lower_right = { // 敵キャラの下の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
                x: Math.ceil(enemy_x),
                y: enemy_y + 1,
            };
            
            // 敵キャラの 1歩下にある床が移動できない場合
            if(map_chip_which_enemy_cannot_move_on.includes(current_map[lower_left.y][lower_left.x]) || 
            map_chip_which_enemy_cannot_move_on.includes(current_map[lower_right.y][lower_right.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
        // 左方向に移動しようとしている場合
        if(this.direction == 2){
            // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対左に一歩進めるので、チェックはスルー
            if((enemy_x) % 1 == 0.5) return;

            let left = { // 敵キャラの左の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真左の床を指す）
                x: enemy_x - 1,
                y: Math.ceil(enemy_y),
            };

            // もしマップの下端の場合、参照する床は敵キャラの左の上側にする
            if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) left.y = Math.floor(enemy_y);

            // 敵キャラの 1歩左にある床が移動できない場合
            if(map_chip_which_enemy_cannot_move_on.includes(current_map[left.y][left.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
        // 右方向に移動しようとしている場合
        if(this.direction == 3){
            // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対右に一歩進めるので、チェックはスルー
            if((enemy_x) % 1 == 0.5) return;

            let right = { // 敵キャラの右の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真右の床を指す）
                x: enemy_x + 1,
                y: Math.ceil(enemy_y),
            };

            // もしマップの下端の場合、参照する床は敵キャラの右の上側にする
            if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) right.y = Math.floor(enemy_y);

            // 敵キャラの 1歩右にある床が移動できない場合
            if(map_chip_which_enemy_cannot_move_on.includes(current_map[right.y][right.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
    }
}