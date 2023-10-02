/* 設定画面 */

import { start } from "./start.js";
import { change_screen_to } from "./common_function/change_screen_to.js";
import { canvas_initialize } from "./../global_function/canvas_initialize.js";
import { Player } from "./common_class/player.js";
import { world_map } from "./common_function/world_map.js";
import { draw_map } from "./common_function/draw_map.js";

export function game(global_info){
    let player_img = {
        front: [global_info.img.yuusha_front1, global_info.img.yuusha_front2],
        back: [global_info.img.yuusha_back1, global_info.img.yuusha_back2],
        left: [global_info.img.yuusha_left1, global_info.img.yuusha_left2],
        right: [global_info.img.yuusha_right1, global_info.img.yuusha_right2],
        arrow: {
            up: global_info.img.arrow_up,
            down: global_info.img.arrow_down,
            left: global_info.img.arrow_left,
            right: global_info.img.arrow_right,
        },
    };
    let player = new Player(8, 8, INITIAL_WORLD_MAP_X, INITIAL_WORLD_MAP_Y, player_img); // プレイヤーキャラクター

    let main_loop = setInterval(function(){
        const TILE_SIZE_IN_CANVAS = global_info.canvas.width / FIELD_SIZE_IN_SCREEN; // 1 タイルの canvas 上でののサイズ

        // canvas をリセット
        canvas_initialize(global_info.canvas, global_info.context);

        // マップを描画する
        let current_map = world_map()[player.world_map_x][player.world_map_y] // 現在プレイヤーが居るマップ
        draw_map(current_map, global_info.canvas, global_info.context, global_info.img.map_chip);

        // プレイヤーの操作をプレイヤーキャラに反映
        player.control(global_info.key);
        // プレイヤーキャラの動きを処理する
        player.action();
        // 描画する
        player.draw(global_info.canvas, global_info.context, TILE_SIZE_IN_CANVAS);

        // Shift ボタンが押されたら、スタート画面に遷移
        if(global_info.key.is_shift_pressed){
            change_screen_to(start, main_loop, global_info);
        }
    }, 1000 / FPS);
}