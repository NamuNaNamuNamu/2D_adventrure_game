/* 設定画面 */

import { start } from "./start.js";
import { change_screen_to } from "./common_function/change_screen_to.js"

export function setting(global_info){
    console.log("設定画面")
    let main_loop = setInterval(function(){
        
        // Enter ボタンが押されたら、スタート画面に遷移
        if(global_info.key.is_enter_pressed){
            change_screen_to(start, main_loop, global_info);
        }
    }, 1000 / FPS);
}