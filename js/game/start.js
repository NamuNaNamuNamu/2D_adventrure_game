/* スタート画面 */

import { setting } from "./setting.js"
import { change_screen_to } from "./common_function/change_screen_to.js"
import { canvas_initialize } from "./../global_function/canvas_initialize.js";

export function start(global_info){
    // メインループ
    let main_loop = setInterval(function(){
        // canvas をリセット
        canvas_initialize(global_info.canvas, global_info.context);

        // 背景（マップ）を映し出す
        draw_background(global_info.canvas, global_info.context, global_info.img.map_chip);
        // "Press Enter to Start" の文字を出す
        draw_text("Press Enter to Start", global_info.canvas, global_info.context);

        // Enter ボタンが押されたら、設定画面に遷移
        if(global_info.key.is_enter_pressed){
            change_screen_to(setting, main_loop, global_info);
        }
    }, 1000 / FPS);

    function draw_background(canvas, context, img){
        /*
        10 × 10 のサイズを持つサンプルマップを背景に描画する
        */

        const IMG_WIDTH = img.naturalWidth;     // マップチップ画像全体の幅
        const IMG_HEIGHT = img.naturalHeight;   // マップチップ画像全体の高さ
        const TOP_LEFT_CORNER_AXIS = {          // マップチップ本体の左上端
            x: 8,
            y: 24,
        }
        const TILE = {
            width: 32,  // マップチップ画像上でのマップチップ 1つ分の幅
            height: 32, // マップチップ画像上でのマップチップ 1つ分の幅
        }
        const FIELD_SIZE_IN_SCREEN = 16; // 1 画面に収まる タイル の数
        const TILE_SIZE_IN_CANVAS = canvas.width / FIELD_SIZE_IN_SCREEN // 1 タイルの canvas 上でののサイズ

        let map_data = get_map_data();
        draw_map(map_data);

        function get_map_data(){
            /*
            0 ... 草原
            1 ... 砂原
            2 ... 海
            3 ... 洞窟の床？みたいな
            4 ... 剣のマークの看板
            5 ... 昇り階段
            6 ... 花つき草原
            7 ... 扉
            8 ... 木
            9 ... 岩
            10 ... テーブル
            11 ... 石レンガ
            12 ... 宝箱(未開封)
            13 ... 宝箱(開封済み)
            14 ... 草つき草原
            15 ... 石レンガ(壁)
            */

            // マップのデータ
            return [
                [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 9, 6, 6, 6, 6],
                [2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 9, 6, 6, 6, 6],
                [2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 9, 9, 6, 9],
                [2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 6, 0, 0, 0, 0, 0],
                [2, 2, 2, 2, 1, 1, 1, 1, 0, 6, 0, 0, 6, 0, 6, 0],
                [2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
                [2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [2, 2, 1, 0, 0, 0, 0, 0, 0, 11, 11, 11, 11, 11, 11, 11],
                [2, 1, 1, 0, 0, 0, 6, 0, 0, 11, 15, 15, 15, 15, 15, 15],
                [2, 0, 0, 0, 0, 0, 0, 0, 0, 11, 3, 5, 3, 13, 3, 12],
                [0, 0, 0, 0, 6, 6, 0, 0, 0, 11, 3, 3, 3, 3, 3, 3],
                [8, 8, 8, 0, 0, 0, 0, 0, 0, 15, 15, 7, 15, 15, 15, 15],
                [8, 14, 14, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 14, 14, 8],
                [8, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
            ]
        }

        function draw_map(map_data){
            /*
            定義したマップデータに従って、描画する
            */

            for(let row = 0; row < FIELD_SIZE_IN_SCREEN; row++){
                for(let column = 0; column < FIELD_SIZE_IN_SCREEN; column++){
                    context.drawImage(
                        img, // img
                        TOP_LEFT_CORNER_AXIS.x + map_data[row][column] % 4 * TILE.width,  // sx (元画像の切り抜き始点 x)
                        TOP_LEFT_CORNER_AXIS.y + Math.floor(map_data[row][column] / 4) * TILE.height,  // sy (元画像の切り抜き始点 y)
                        TILE.width,  // s_width (元画像の切り抜きサイズ 横幅)
                        TILE.height,  // s_height (元画像の切り抜きサイズ 縦幅)
                        column * TILE_SIZE_IN_CANVAS,  // dx (canvas の描画開始位置 x)
                        row * TILE_SIZE_IN_CANVAS,  // dy (canvas の描画開始位置 y)
                        TILE_SIZE_IN_CANVAS,  // d_width (canvas の描画サイズ 横幅)
                        TILE_SIZE_IN_CANVAS,  // d_height (canvas の描画サイズ 縦幅)
                    );
                }
            }
        }
    }

    function draw_text(text, canvas, context){
        const FONT_COEFFICIENT = 0.05; // canvasサイズを適切な文字のフォントサイズに合わせるための係数

        context.fillStyle = "rgb(0,0,0)";
        context.textAlign = "center";
        context.font = `${canvas.width * FONT_COEFFICIENT}px serif`;
        context.fillText(text, canvas.width * 0.5, canvas.height * 0.5);
    }
}