/* スタート画面 */

import { setting } from "./setting.js"
import { change_screen_to } from "./common_function/change_screen_to.js"

export function start(global_info){
    console.log("スタート画面");
    let main_loop = setInterval(function(){
        
        // Enter ボタンが押されたら、設定画面に遷移
        if(global_info.key.is_enter_pressed){
            change_screen_to(setting, main_loop, global_info);
        }
    }, 1000 / FPS);
}