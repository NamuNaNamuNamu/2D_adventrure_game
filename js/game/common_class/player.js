/* プレイヤーキャラクターを表すクラス */

import { Arrow } from "./arrow.js";
import { world_map } from "./../common_function/world_map.js";
import { generate_enemies } from "../common_function/generate_enemies.js";
import { delete_enemies } from "../common_function/delete_enemies.js";

const PLAYER_SPEED_COEFFICIENT = 0.33;    // プレイヤーのスピードの係数
const MOVE_COOL_TIME = 3; // 移動クールタイム（1歩で 3フレーム費やす）
const ATTACK_COOL_TIME = 10; // 攻撃クールタイム
const MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON = [ // プレイヤーが移動できない床
    2,  // 海
    4,  // 剣のマークの看板
    8,  // 木
    9,  // 岩
    10, // テーブル
    11, // 石レンガ
    15, // 石レンガ(壁)
];

export class Player{
    
    // コンストラクタ
    constructor(x, y, world_map_x, world_map_y, img, hp){
        const WIDTH = 0.6;
        const HEIGHT = 0.6;
        this.x = x;                         // x 座標(タイル基準 = 一番左が 0, 一番右が 16), プレイヤーの画像の中心の座標とする
        this.y = y;                         // y 座標(タイル基準 = 一番上が 0, 一番下が 16), プレイヤーの画像の中心の座標とする
        this.world_map_x = world_map_x;     // 現在プレイヤーがいる ワールドマップの x 座標
        this.world_map_y = world_map_y;     // 現在プレイヤーがいる ワールドマップの y 座標
        this.width = WIDTH;
        this.height = HEIGHT;
        this.img = img;                     // 写真 (front: 正面, back: 背面, left: 左, right: 右)
        this.direction = 0;                 // 身体の向き (0: 背面, 1: 正面, 2: 左, 3: 右)
        this.color = 0;                     // 色 (0: 青, 1: オレンジ)
        this.animation_frame = 0;           // 写真のアニメーション (0 と 1 を交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                        // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                      // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
            damaged: 0,                     // 被ダメージフレーム数。一回ダメージを受けたら、このフレーム分は無敵。
        };
        this.hp = hp;                       // HP
        this.max_hp = hp;                   // 最大HP
        this.arrows = [];                   // 放った弓矢
    }

    // プレイヤーの操作を反映
    // direction と、in_action_frame.move, in_action_frame.attack を変更し、行動の準備をする。
    control(key){
        // 移動アクション中でなければ、操作を受け付ける
        if(this.in_action_frame.move <= 0){
            // w, a, s, d キー入力に応じて移動させる
            if(key.is_w_pressed){ 
                this.direction = 0; // 上方向
                this.in_action_frame.move = MOVE_COOL_TIME;
                this.check_movability(); // 上方向に移動可能かどうか確かめる
            }
            else if(key.is_s_pressed){
                this.direction = 1; // 下方向
                this.in_action_frame.move = MOVE_COOL_TIME;
                this.check_movability(); // 下方向に移動可能かどうか確かめる
            }
            else if(key.is_a_pressed){
                this.direction = 2; // 左方向
                this.in_action_frame.move = MOVE_COOL_TIME;
                this.check_movability(); // 左方向に移動可能かどうか確かめる
            }
            else if(key.is_d_pressed){
                this.direction = 3; // 右方向
                this.in_action_frame.move = MOVE_COOL_TIME;
                this.check_movability(); // 右方向に移動可能かどうか確かめる
            }
        }

        // 攻撃アクション中でなければ、操作を受け付ける
        if(this.in_action_frame.attack <= 0){
            if(key.is_enter_pressed){
                this.in_action_frame.attack = ATTACK_COOL_TIME; // 攻撃クールタイムがある
            }
        }
    }

    // 進もうとしている方向に進めるかどうか確かめる
    // 進めない例: 移動しようとしている方向に、移動できない床がある場合など。
    // 進めない場合、ここで、in_action_frame.move を 0 にすることで、移動を中止する
    check_movability(){
        // 現在プレイヤーが居るマップ
        let current_map = world_map()[this.world_map_y][this.world_map_x].map_data;
        let player_x = this.x - 0.5; // プレイヤーの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
        let player_y = this.y - 0.5; // プレイヤーの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0

        // 上方向に移動しようとしている場合
        if(this.direction == 0){
            // プレイヤーが上下において、ぴったりタイルの上に乗っている場合、絶対上に一歩進めるので、チェックはスルー
            if(player_y % 1 == 0) return;

            // もしマップの上端の場合、絶対上に一歩進めるので、チェックはスルー
            if(player_y <= 0) return;
            
            let upper_left = { // プレイヤーの上の左側にある床（プレイヤーが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
                x: Math.floor(player_x),
                y: player_y - 0.5,
            };
            let upper_right = { // プレイヤーの上の右側にある床（プレイヤーが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
                x: Math.ceil(player_x),
                y: player_y - 0.5,
            };

            // プレイヤーの半歩上にある床が移動できない場合
            if(MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON.includes(current_map[upper_left.y][upper_left.x]) || 
            MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON.includes(current_map[upper_right.y][upper_right.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
        // 下方向に移動しようとしている場合
        if(this.direction == 1){
            // プレイヤーが上下において、ぴったりタイルの上に乗っていない場合、絶対下に一歩進めるので、チェックはスルー
            if(Math.abs((player_y) % 1) == 0.5) return; // NOTE: -0.5 % 1 は 0.5 ではなく、-0.5 となってしまうので、絶対値を取って回避。

            // もしマップの下端の場合、絶対下に一歩進めるので、チェックはスルー
            if(player_y >= FIELD_SIZE_IN_SCREEN - 1) return;

            let lower_left = { // プレイヤーの下の左側にある床（プレイヤーが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
                x: Math.floor(player_x),
                y: player_y + 1,
            };
            let lower_right = { // プレイヤーの下の右側にある床（プレイヤーが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
                x: Math.ceil(player_x),
                y: player_y + 1,
            };
            
            // プレイヤーの 1歩下にある床が移動できない場合
            if(MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON.includes(current_map[lower_left.y][lower_left.x]) || 
            MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON.includes(current_map[lower_right.y][lower_right.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
        // 左方向に移動しようとしている場合
        if(this.direction == 2){
            // プレイヤーが左右において、ぴったりタイルの上に乗っていない場合、絶対左に一歩進めるので、チェックはスルー
            if((player_x) % 1 == 0.5) return;

            let left = { // プレイヤーの左の下側にある床（プレイヤーが上下において、ぴったりタイルの上に乗っている場合、真左の床を指す）
                x: player_x - 1,
                y: Math.ceil(player_y),
            };

            // もしマップの下端の場合、参照する床はプレイヤーの左の上側にする
            if(player_y >= FIELD_SIZE_IN_SCREEN - 1) left.y = Math.floor(player_y);

            // プレイヤーの 1歩左にある床が移動できない場合
            if(MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON.includes(current_map[left.y][left.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
        // 右方向に移動しようとしている場合
        if(this.direction == 3){
            // プレイヤーが左右において、ぴったりタイルの上に乗っていない場合、絶対右に一歩進めるので、チェックはスルー
            if((player_x) % 1 == 0.5) return;

            let right = { // プレイヤーの右の下側にある床（プレイヤーが上下において、ぴったりタイルの上に乗っている場合、真右の床を指す）
                x: player_x + 1,
                y: Math.ceil(player_y),
            };

            // もしマップの下端の場合、参照する床はプレイヤーの右の上側にする
            if(player_y >= FIELD_SIZE_IN_SCREEN - 1) right.y = Math.floor(player_y);

            // プレイヤーの 1歩右にある床が移動できない場合
            if(MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON.includes(current_map[right.y][right.x])){
                // 移動は行わない
                this.in_action_frame.move = 0;
            }
        }
    }

    // 実際の動作処理を行う
    action(img, enemies){
        this.move(img, enemies);
        this.attack();
        this.damaged();
    }

    // 弓矢とプレイヤーキャラを実際に動かす。
    // 弓矢は問答無用で動くが、プレイヤーキャラは、in_action_frame.move が 1 以上のときに移動する
    move(img, enemies){
        // 弓矢を動かす
        for(let arrow of this.arrows){
            arrow.move(this.arrows);
        }

        // アクションが終了したら、プレイヤーの動作は行わない (次の動作命令に向けて待機)
        if(this.in_action_frame.move <= 0) return;

        // キー入力に応じて移動させる
        if(this.direction == 0) this.y = Math.round((this.y - MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 1) this.y = Math.round((this.y + MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * PLAYER_SPEED_COEFFICIENT) * 100) / 100;

        // 動作フレームを 1 進める
        this.in_action_frame.move--;
        // 動作しきったタイミングで、
        if(this.in_action_frame.move == 0){
            // 座標の誤差を補正する
            this.x = Math.round(this.x * 2) * 0.5;
            this.y = Math.round(this.y * 2) * 0.5;
            // アニメーションを 1 動かす(0 なら 1 に。1 なら 0 に)
            this.animation_frame = (this.animation_frame + 1) % 2;
        }

        // マップ移動処理
        if(this.x < 0){
            this.x += FIELD_SIZE_IN_SCREEN;
            this.world_map_x--;
            this.arrows = [];   // マップ移動したら、弓矢は全て消す
            delete_enemies(enemies); // マップ移動したら、現在のマップにいる敵も全て消す
            generate_enemies(this.world_map_x, this.world_map_y, img, enemies); // 移動先のマップに生息している敵キャラを生み出す
        }
        if(this.x > FIELD_SIZE_IN_SCREEN){
            this.x -= FIELD_SIZE_IN_SCREEN;
            this.world_map_x++;
            this.arrows = [];   // マップ移動したら、弓矢は全て消す
            delete_enemies(enemies); // マップ移動したら、現在のマップにいる敵も全て消す
            generate_enemies(this.world_map_x, this.world_map_y, img, enemies); // 移動先のマップに生息している敵キャラを生み出す
        }
        if(this.y < 0){
            this.y += FIELD_SIZE_IN_SCREEN;
            this.world_map_y--;
            this.arrows = [];   // マップ移動したら、弓矢は全て消す
            delete_enemies(enemies); // マップ移動したら、現在のマップにいる敵も全て消す
            generate_enemies(this.world_map_x, this.world_map_y, img, enemies); // 移動先のマップに生息している敵キャラを生み出す
        }
        if(this.y > FIELD_SIZE_IN_SCREEN){
            this.y -= FIELD_SIZE_IN_SCREEN;
            this.world_map_y++;
            this.arrows = [];   // マップ移動したら、弓矢は全て消す
            delete_enemies(enemies); // マップ移動したら、現在のマップにいる敵も全て消す
            generate_enemies(this.world_map_x, this.world_map_y, img, enemies); // 移動先のマップに生息している敵キャラを生み出す
        }
    }

    // プレイヤーの攻撃命令 を受けて、弓矢を生成する
    attack(){
        // アクションが終了したら、動作は行わない
        if(this.in_action_frame.attack <= 0) return;

        // 攻撃命令を受け付けたその時だけ弓矢を生成
        if(this.in_action_frame.attack == ATTACK_COOL_TIME){
            let arrow = new Arrow(this.x, this.y, this.direction, this.img.arrow);
            this.arrows.push(arrow);
        }

        // 攻撃フレームを 1 進める
        this.in_action_frame.attack--;
    }

    // 今のところは、被ダメージフレームを進めるだけの処理
    damaged(){
        // 無敵時間が終了したら、無敵時間経過は行わない
        if(this.in_action_frame.damaged < 0) return;

        // in_action_frame.damaged が 3フレーム進むごとに、色をオレンジと青で交互に変える
        // 0 フレーム ... 青
        // 1 ~ 2  フレーム ... オレンジ
        // 3 ~ 4  フレーム ... 青
        // 5 ~ 6  フレーム ... オレンジ
        // 7 ~ 8 フレーム ... 青
        // ...
        const BLUE = 0;
        const ORANGE = 1;
        const CHANGE_COLOR_FRAME = 2;
        if(Math.ceil(this.in_action_frame.damaged / CHANGE_COLOR_FRAME) % 2 == 0) this.color = BLUE;
        if(Math.ceil(this.in_action_frame.damaged / CHANGE_COLOR_FRAME) % 2 == 1) this.color = ORANGE;

        // 被ダメージフレームを 1 進める
        this.in_action_frame.damaged--;
    }

    // 描画する
    draw(canvas, context, tile_size_in_canvas){
        // 弓矢の描画
        for(let arrow of this.arrows){
            arrow.draw(canvas, context, tile_size_in_canvas);
        }

        // プレイヤー自身の描画
        let player_img;
        // 色の確定
        const BLUE = 0;
        const ORANGE = 1;
        if(this.color == BLUE) player_img = this.img.blue;
        if(this.color == ORANGE) player_img = this.img.orange;

        if(this.direction == 0) player_img = player_img.back[this.animation_frame];
        if(this.direction == 1) player_img = player_img.front[this.animation_frame];
        if(this.direction == 2) player_img = player_img.left[this.animation_frame];
        if(this.direction == 3) player_img = player_img.right[this.animation_frame];

        context.drawImage(
            player_img, // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );

        // HPバーの描画
        const HP_BAR_WIDTH_COEFFICIENT = 0.25;              // HPバーの幅に係る係数
        const HP_BAR_HEIGHT_COEFFICIENT = 0.015;            // HPバーの高さに係る係数
        const HP_BAR_OUTSIDE_WIDTH_COEFFICIENT = 1;         // HPバーの外側の白い部分の横のサイズ比
        const HP_BAR_OUTSIDE_HEIGHT_COEFFICIENT = 1;        // HPバーの外側の白い部分の縦のサイズ比
        const HP_BAR_INSIDE_WIDTH_COEFFICIENT = 0.96;       // HPバーの内側の赤い部分の横のサイズ比
        const HP_BAR_INSIDE_HEIGHT_COEFFICIENT = 0.4;       // HPバーの内側の赤い部分の縦のサイズ比

        const HP_BAR_X = 0.14;  // canvas の横幅を 1 としたときの HPバーの横の中心 x座標
        const HP_BAR_Y = 0.02;  // canvas の縦幅を 1 としたときの HPバーの横の中心 y座標
        const OUTSIDE_WIDTH = canvas.width * HP_BAR_WIDTH_COEFFICIENT * HP_BAR_OUTSIDE_WIDTH_COEFFICIENT;       // HPバーの外側横幅
        const OUTSIDE_HEIGHT = canvas.height * HP_BAR_HEIGHT_COEFFICIENT * HP_BAR_OUTSIDE_HEIGHT_COEFFICIENT;   // HPバーの外側縦幅
        const INSIDE_WIDTH = canvas.width * HP_BAR_WIDTH_COEFFICIENT * HP_BAR_INSIDE_WIDTH_COEFFICIENT;         // HPバーの内側の横幅
        const INSIDE_HEIGHT = canvas.height * HP_BAR_HEIGHT_COEFFICIENT * HP_BAR_INSIDE_HEIGHT_COEFFICIENT;     // HPバーの内側の縦幅

        // 外側の白い部分
        context.fillStyle = "rgb(255, 255, 255)";
        context.fillRect(
            canvas.width * HP_BAR_X - OUTSIDE_WIDTH * 0.5,
            canvas.height * HP_BAR_Y - OUTSIDE_HEIGHT * 0.5,
            OUTSIDE_WIDTH,
            OUTSIDE_HEIGHT,
        );

        // HPバーの内側の赤色の部分
        context.fillStyle = "rgb(215, 0, 0)";
        context.fillRect(
            canvas.width * HP_BAR_X - INSIDE_WIDTH * 0.5,
            canvas.height * HP_BAR_Y - INSIDE_HEIGHT * 0.5,
            INSIDE_WIDTH,
            INSIDE_HEIGHT,
        );

        // HPバーの内側の緑色の部分
        context.fillStyle = "rgb(0, 185, 0)";
        context.fillRect(
            canvas.width * HP_BAR_X - INSIDE_WIDTH * 0.5,
            canvas.height * HP_BAR_Y - INSIDE_HEIGHT * 0.5,
            INSIDE_WIDTH * (this.hp / this.max_hp),
            INSIDE_HEIGHT,
        );
    }

    // ダメージを受ける処理。
    // NOTE: ダメージ発生時に敵クラスから呼び出す
    is_damaged(damage, frame){
        // もし、無敵時間中なら、ダメージは発生しない
        if(this.in_action_frame.damaged > 0) return;
        
        // HP を ダメージ数分減らす
        this.hp -= damage;
        // 無敵時間を付与
        this.in_action_frame.damaged = frame;
    }
}