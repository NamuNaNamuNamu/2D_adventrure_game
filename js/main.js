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

    // 画像の用意 // NOTE: 先に画像を用意しておかないと読み込みに時間がかかる
    let img = prepare_images();

    // 入力情報をまとめてもっておく key オブジェクトを用意
    let key = new Key();
    // 入力の受付を開始する
    start_receiving_input(key);

    // ゲームの処理に必要な情報をまとめる
    let global_info = {
        canvas: canvas,
        context: context,
        key: key,
        img: img,
    }
    // 最後の画像 (yuusha_right2) の読み込みが完了したら、スタート画面の描画を開始する
    global_info.img.yuusha_right2.addEventListener("load", function(){
        game.start(global_info);
    }, false);

    function determine_canvas_size(canvas){
        /*
        canvas のサイズを、ブラウザの画面に合わせて、
        出来るだけ大きい正方形に整形する
        */

        let one_side = 0; // 画面の1辺のサイズ

        // 画面めいっぱいになるような canvas の 1辺のサイズを決める
        if(document.documentElement.clientWidth > document.documentElement.clientHeight){
            one_side = document.documentElement.clientHeight * CANVAS_SIZE_RATIO;
            one_side = one_side - one_side % 16;
        }
        else{
            one_side = document.documentElement.clientWidth * CANVAS_SIZE_RATIO;
            one_side = one_side - one_side % 16;
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

    function prepare_images(){
        // マップチップの写真のパス
        const MAP_CHIP_IMG_PATH = "../img/map_chip.png";
        // 黒いウィンドウの写真のパス
        const BLACK_WINDOW_IMG_PATH = "../img/black_window.png";
        // 右向きの白い矢印の写真のパス
        const TRIANGLE_RIGHT_IMG_PATH = "../img/triangle_right.png";
        // 弓矢の写真のパス
        const ARROW_UP_IMG_PATH = "../img/arrow_up.png";
        const ARROW_DOWN_IMG_PATH = "../img/arrow_down.png";
        const ARROW_LEFT_IMG_PATH = "../img/arrow_left.png";
        const ARROW_RIGHT_IMG_PATH = "../img/arrow_right.png";
        // 敵キャラの写真のパス
        const BLUE_SLIME_IMG_PATH = "../img/enemies/blue_slime.png";
        // プレイヤーキャラの写真のパス
        const YUUSHA_ORANGE_FRONT1_IMG_PATH = "../img/yuusha_orange_front1.png";
        const YUUSHA_ORANGE_FRONT2_IMG_PATH = "../img/yuusha_orange_front2.png";
        const YUUSHA_ORANGE_BACK1_IMG_PATH = "../img/yuusha_orange_back1.png";
        const YUUSHA_ORANGE_BACK2_IMG_PATH = "../img/yuusha_orange_back2.png";
        const YUUSHA_ORANGE_LEFT1_IMG_PATH = "../img/yuusha_orange_left1.png";
        const YUUSHA_ORANGE_LEFT2_IMG_PATH = "../img/yuusha_orange_left2.png";
        const YUUSHA_ORANGE_RIGHT1_IMG_PATH = "../img/yuusha_orange_right1.png";
        const YUUSHA_ORANGE_RIGHT2_IMG_PATH = "../img/yuusha_orange_right2.png";
        const YUUSHA_FRONT1_IMG_PATH = "../img/yuusha_front1.png";
        const YUUSHA_FRONT2_IMG_PATH = "../img/yuusha_front2.png";
        const YUUSHA_BACK1_IMG_PATH = "../img/yuusha_back1.png";
        const YUUSHA_BACK2_IMG_PATH = "../img/yuusha_back2.png";
        const YUUSHA_LEFT1_IMG_PATH = "../img/yuusha_left1.png";
        const YUUSHA_LEFT2_IMG_PATH = "../img/yuusha_left2.png";
        const YUUSHA_RIGHT1_IMG_PATH = "../img/yuusha_right1.png";
        const YUUSHA_RIGHT2_IMG_PATH = "../img/yuusha_right2.png";
        
        // 画像をロードして、辞書型データ形式で返却
        return {
            map_chip: generate_img_object(MAP_CHIP_IMG_PATH),
            black_window: generate_img_object(BLACK_WINDOW_IMG_PATH),
            triangle_right: generate_img_object(TRIANGLE_RIGHT_IMG_PATH),
            arrow_up: generate_img_object(ARROW_UP_IMG_PATH),
            arrow_down: generate_img_object(ARROW_DOWN_IMG_PATH),
            arrow_left: generate_img_object(ARROW_LEFT_IMG_PATH),
            arrow_right: generate_img_object(ARROW_RIGHT_IMG_PATH),
            blue_slime: generate_img_object(BLUE_SLIME_IMG_PATH),
            yuusha_orange_front1: generate_img_object(YUUSHA_ORANGE_FRONT1_IMG_PATH),
            yuusha_orange_front2: generate_img_object(YUUSHA_ORANGE_FRONT2_IMG_PATH),
            yuusha_orange_back1: generate_img_object(YUUSHA_ORANGE_BACK1_IMG_PATH),
            yuusha_orange_back2: generate_img_object(YUUSHA_ORANGE_BACK2_IMG_PATH),
            yuusha_orange_left1: generate_img_object(YUUSHA_ORANGE_LEFT1_IMG_PATH),
            yuusha_orange_left2: generate_img_object(YUUSHA_ORANGE_LEFT2_IMG_PATH),
            yuusha_orange_right1: generate_img_object(YUUSHA_ORANGE_RIGHT1_IMG_PATH),
            yuusha_orange_right2: generate_img_object(YUUSHA_ORANGE_RIGHT2_IMG_PATH),
            yuusha_front1: generate_img_object(YUUSHA_FRONT1_IMG_PATH),
            yuusha_front2: generate_img_object(YUUSHA_FRONT2_IMG_PATH),
            yuusha_back1: generate_img_object(YUUSHA_BACK1_IMG_PATH),
            yuusha_back2: generate_img_object(YUUSHA_BACK2_IMG_PATH),
            yuusha_left1: generate_img_object(YUUSHA_LEFT1_IMG_PATH),
            yuusha_left2: generate_img_object(YUUSHA_LEFT2_IMG_PATH),
            yuusha_right1: generate_img_object(YUUSHA_RIGHT1_IMG_PATH),
            yuusha_right2: generate_img_object(YUUSHA_RIGHT2_IMG_PATH),
        }

        function generate_img_object(img_path){
            let img = new Image();
            img.src = img_path;
            return img;
        }
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