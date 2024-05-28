/* 設定画面 */

import { start } from "./01_start.js";
import { change_screen_to } from "../common_function/change_screen_to.js";
import { canvas_initialize } from "../../global_function/canvas_initialize.js";

export function setting(global_info){
    console.log("設定画面")
    let main_loop = setInterval(function(){
        // canvas をリセット
        canvas_initialize(global_info.canvas, global_info.context);
        
        // Shift ボタンが押されたら、スタート画面に遷移
        if(global_info.key.is_shift_pressed){
            change_screen_to(start, main_loop, global_info);
        }
    }, 1000 / FPS);
}