/* スタート画面 */

import { game } from "./game.js";
import { setting } from "./setting.js"
import { change_screen_to } from "./common_function/change_screen_to.js";
import { canvas_initialize } from "./../global_function/canvas_initialize.js";

export function start(global_info){
    let selected = {    // 選択されている項目
        start: true,
        setting: false,
    }

    // メインループ
    let main_loop = setInterval(function(){
        // canvas をリセット
        canvas_initialize(global_info.canvas, global_info.context);

        // プレイヤーの操作に応じて、ポインタの位置を変更する
        decide_pointer_location(global_info.key);
    
        // 背景（マップ）を映し出す
        draw_background(global_info.canvas, global_info.context, global_info.img.map_chip);
        // タイトル を写し出す
        draw_title("あいうえおアクション(仮)", global_info.canvas, global_info.context);
        // プレイヤーが操作可能なウィンドウ を映し出す
        draw_player_controllable_window(global_info.canvas, global_info.context, global_info.img.black_window, global_info.img.triangle_right, selected);

        // Enter ボタンが押されたら、
        if(global_info.key.is_enter_pressed){
            // 「はじめる」にカーソルがあっていた場合、ゲーム画面に遷移
            if(selected.start) change_screen_to(game, main_loop, global_info);
            // 「せってい」にカーソルがあっていた場合、設定画面に遷移
            if(selected.setting) change_screen_to(setting, main_loop, global_info);
        }
    }, 1000 / FPS);

    function decide_pointer_location(key){
        if(key.is_a_pressed){
            selected = {
                start: true,    // ポインタを「はじめる」に合わせる
                setting: false,
            }
        }
        if(key.is_d_pressed){
            selected = {
                start: false,
                setting: true,  // ポインタを「せってい」に合わせる
            }
        }
    }

    function draw_background(canvas, context, img){
        /*
        16 × 16 のサイズを持つサンプルマップを背景に描画する
        */

        const TOP_LEFT_CORNER_AXIS = {          // マップチップ本体の左上端
            x: 8,
            y: 24,
        }
        const TILE = {
            width: 32,  // マップチップ画像上でのマップチップ 1つ分の幅
            height: 32, // マップチップ画像上でのマップチップ 1つ分の幅
        }
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

    function draw_title(text, canvas, context){
        const FONT_COEFFICIENT = 0.05; // canvasサイズを適切な文字のフォントサイズに合わせるための係数

        context.fillStyle = "rgb(0,0,0)";
        context.textAlign = "center";
        context.font = `bold ${canvas.width * FONT_COEFFICIENT}px serif`;
        context.fillText(text, canvas.width * 0.5, canvas.height * 0.45);
    }

    function draw_player_controllable_window(canvas, context, black_window, triangle_right, selected){
        /*
        以下の項目を持ったプレイヤーが操作可能なウィンドウを描く
        - はじめる
        - せってい
        */
        const AXIS = { // canvas 上での位置。0 ~ 1 の間で決定
            x: 0.5, 
            y: 0.8,
        };
        const COEFFICIENT_OF_SIZE_IN_CANVAS = 0.0005; // canvas 上でのウィンドウサイズ係数

        draw_black_window(canvas, context, black_window);
        draw_text_in_window(canvas, context);
        draw_pointer(canvas, context, triangle_right, selected);

        function draw_black_window(canvas, context, black_window){
            const BLACK_WINDOW = { // pngファイル上での黒ウィンドウのサイズ
                width: black_window.naturalWidth,
                height: black_window.naturalHeight * 0.25, // pngファイルの上部 1 / 4 に黒ウィンドウがある
            }
            
            context.drawImage(
                black_window, // img
                0,  // sx (元画像の切り抜き始点 x)
                0,  // sy (元画像の切り抜き始点 y)
                BLACK_WINDOW.width,  // s_width (元画像の切り抜きサイズ 横幅)
                BLACK_WINDOW.height,  // s_height (元画像の切り抜きサイズ 縦幅)
                canvas.width * AXIS.x - (BLACK_WINDOW.width * canvas.width * COEFFICIENT_OF_SIZE_IN_CANVAS) * 0.5,  // dx (canvas の描画開始位置 x)
                canvas.height * AXIS.y - (BLACK_WINDOW.height * canvas.height * COEFFICIENT_OF_SIZE_IN_CANVAS) * 0.5,  // dy (canvas の描画開始位置 y)
                BLACK_WINDOW.width * canvas.width * COEFFICIENT_OF_SIZE_IN_CANVAS,  // d_width (canvas の描画サイズ 横幅)
                BLACK_WINDOW.height * canvas.height * COEFFICIENT_OF_SIZE_IN_CANVAS,  // d_height (canvas の描画サイズ 縦幅)
            );
        }

        function draw_text_in_window(canvas, context){
            context.fillStyle = "rgb(255,255,255)";
            context.textAlign = "center";
            context.font = `${canvas.width * COEFFICIENT_OF_SIZE_IN_CANVAS * 72}px serif`;
            
            context.fillText("はじめる", canvas.width * 0.32, canvas.height * 0.82);
            context.fillText("せってい", canvas.width * 0.68, canvas.height * 0.82);
        }

        function draw_pointer(canvas, context, triangle_right, selected){
            /*
            プレイヤーの選択を表すポインタを描画する
            */
           
            let pointer_axis = {
                x: 0, // canvas 上での位置。0 ~ 1 の間で決定
                y: 0, // canvas 上での位置。0 ~ 1 の間で決定
            }

            // selected 情報に合わせて、描画位置を変える
            if(selected.start){
                pointer_axis = {
                    x: 0.22, // canvas 上での位置。0 ~ 1 の間で決定
                    y: 0.805, // canvas 上での位置。0 ~ 1 の間で決定
                }
            }
            if(selected.setting){
                pointer_axis = {
                    x: 0.58, // canvas 上での位置。0 ~ 1 の間で決定
                    y: 0.805, // canvas 上での位置。0 ~ 1 の間で決定
                }
            }
            
            context.drawImage(
                triangle_right, // img
                canvas.width * pointer_axis.x - canvas.width * COEFFICIENT_OF_SIZE_IN_CANVAS * 93.75 * 0.5,  // dx (canvas の描画開始位置 x)
                canvas.height * pointer_axis.y - canvas.height * COEFFICIENT_OF_SIZE_IN_CANVAS * 93.75 * 0.5,  // dy (canvas の描画開始位置 y)
                canvas.width * COEFFICIENT_OF_SIZE_IN_CANVAS * 93.75,  // d_width (canvas の描画サイズ 横幅)
                canvas.height * COEFFICIENT_OF_SIZE_IN_CANVAS * 93.75,  // d_height (canvas の描画サイズ 縦幅)
            );
        }
    }
}