/* main 関数 */
// 一番最初に呼ばれる関数

import * as game from "./game/start.js";
import { Key } from "./global_class/key.js";
import { canvas_initialize } from "./global_function/canvas_initialize.js";

export function main(){
    // canvas の用意
    let canvas = document.getElementById("main_canvas");    
    let context = canvas.getContext("2d");
    // canvas サイズを決める
    determine_canvas_size(canvas);
    // canvas を 初期化 (まっさらな画面を描画）
    canvas_initialize(canvas, context);
    // 画面の大きさが変更されたときに canvas サイズをリサイズするようにする
    start_automatic_screen_size_correction(canvas, context);
    // 入力情報をまとめてもっておく key オブジェクトを用意
    let key = new Key();
    // 入力の受付を開始する
    start_receiving_input(key);

    // スタート画面の描画を開始する
    let global_info = {
        canvas: canvas,
        context: context,
        key: key,
    }
    game.start(global_info);

    function determine_canvas_size(canvas){
        /*
        canvas のサイズを、ブラウザの画面に合わせて、
        出来るだけ大きい正方形に整形する
        */

        let one_side = 0; // 画面の1辺のサイズ

        // 画面めいっぱいになるような canvas の 1辺のサイズを決める
        if(document.documentElement.clientWidth > document.documentElement.clientHeight){
            one_side = document.documentElement.clientHeight * CANVAS_SIZE_RATIO;
        }
        else{
            one_side = document.documentElement.clientWidth * CANVAS_SIZE_RATIO;
        }

        canvas.width = one_side;
        canvas.height = one_side;
    }

    function start_automatic_screen_size_correction(canvas, context){
        /*
        ブラウザサイズを変更したときに、それに合わせて、
        canvas のサイズを変更するイベントリスナーを起動する
        */

        window.addEventListener("resize", function(){
            determine_canvas_size(canvas);
            canvas_initialize(canvas, context);
        }, false);
    }

    function start_receiving_input(key){
        /*
        - 以下の入力の受付を開始する
            - ボタンが押されたこと
            - ボタンが離されたこと
            - (スマホ) 画面がタッチされたこと // To be implemented ...

        => すべて key オブジェクトに情報を格納する (例: wキーが押された、離された などの情報)
        */

        // 何かボタンが押されたときの処理
        document.addEventListener("keydown", function(event){
            // デフォルトのイベントを発生させない (本来のそのキーの役割を無効化)
            event.preventDefault();
            key.pressed(event.key);
        }, false);

        // 何かボタンが離されたときの処理
        document.addEventListener("keyup", function(event){
            // デフォルトのイベントを発生させない (本来のそのキーの役割を無効化)
            event.preventDefault();
            key.released(event.key);
        }, false);
    }
}