/* 画面遷移する関数 */

export function change_screen_to(screen, loop, global_info){
    // ループを消去
    clearInterval(loop);
    // 第 1 引数で指定したメソッド名を持つ画面に遷移
    screen(global_info);
}