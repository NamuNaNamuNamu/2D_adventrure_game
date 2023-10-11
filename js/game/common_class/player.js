/* プレイヤーキャラクターを表すクラス */

import { Arrow } from "./arrow.js";
import { world_map } from "./../common_function/world_map.js";
import { generate_enemies } from "./../common_function/generate_enemies.js";
import { delete_all } from "./../common_function/delete_all.js";
import { change_map_by_stairs_list } from "./../common_function/change_map_by_stairs_list.js";
import { change_map_from_map_x0_y1_to_map_x0_y0 } from "./../common_function/change_map_from_map_x0_y1_to_map_x0_y0.js"
import { delete_one } from "../common_function/delete_one.js";

const HIT_BOX = {  // プレイヤーキャラの当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.6,    // 横幅
    height: 0.6,   // 縦幅
}
const COOL_TIME = { // それぞれの行動のクールタイム
    move: 3,        // 移動クールタイム（1歩で 3 フレーム費やす）
    attack: 10      // 攻撃クールタイム
}
const COLOR = {
    blue: 0,       // 青 
    orange: 1,     // オレンジ
}
const PLAYER_SPEED_COEFFICIENT = 0.33;    // プレイヤーのスピードの係数
const MAP_CHIP_WHICH_PLAYER_CANNOT_MOVE_ON = [ // プレイヤーが移動できない床
    2,  // 木付き草原
    3,  // 岩付き草原
    7,  // 木付き深い草原
    8,  // 岩付き深い草原
    12, // 木付き砂原
    13, // 岩付き砂原
    15, // テーブル
    18, // 木付き深い砂原
    19, // 岩付き深い砂原
    23, // 扉付き青床
    26, // 扉付き紫床
    28, // 石レンガ (灰色)
    29, // 石レンガ壁 (灰色)
    30, // 石レンガ (青色)
    31, // 石レンガ壁 (青色)
    33, // 木付き青床
    34, // 岩つき青床
    37, // 木付き紫床
    38, // 岩付き紫床
    40, // 海
    41, // 深い海
];

export class Player{
    
    // コンストラクタ
    constructor(x, y, world_map_x, world_map_y, img, hp, atk){
        this.x = x;                         // x 座標(タイル基準 = 一番左が 0, 一番右が 16), プレイヤーの画像の中心の座標とする
        this.y = y;                         // y 座標(タイル基準 = 一番上が 0, 一番下が 16), プレイヤーの画像の中心の座標とする
        this.world_map_x = world_map_x;     // 現在プレイヤーがいる ワールドマップの x 座標
        this.world_map_y = world_map_y;     // 現在プレイヤーがいる ワールドマップの y 座標
        this.width = HIT_BOX.width;         // プレイヤーの当たり判定の横幅
        this.height = HIT_BOX.height;       // プレイヤーの当たり判定の縦幅
        this.img = img;                     // 写真 (front: 正面, back: 背面, left: 左, right: 右)
        this.direction = 0;                 // 身体の向き (0: 背面(上), 1: 正面(下), 2: 左, 3: 右)
        this.color = COLOR.blue;            // 色 (0: 青, 1: オレンジ)
        this.foot_print = [];               // 1 マップ上での足跡（移動した軌跡）
        this.animation_frame = 0;           // 写真のアニメーション (0 と 1 を交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                        // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                      // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
            damaged: 0,                     // 被ダメージフレーム数。一回ダメージを受けたら、このフレーム分は無敵。
        };
        this.max_hp = hp;                   // 最大HP
        this.status = {
            hp: hp,                         // HP
            atk: atk,                       // 攻撃力
        }
        this.arrows = [];                   // 放った弓矢
    }

    // プレイヤーの操作を反映
    // game.js の メインループから呼び出される
    // direction と、in_action_frame.move, in_action_frame.attack を変更し、行動の準備をする。
    control(key){
        // 移動アクション中でなければ、操作を受け付ける
        if(this.in_action_frame.move <= 0){
            // w, a, s, d キー入力に応じて移動させる
            if(key.is_w_pressed){ 
                this.direction = 0; // 上方向
                this.in_action_frame.move = COOL_TIME.move;
                this.check_movability(); // 上方向に移動可能かどうか確かめる
            }
            else if(key.is_s_pressed){
                this.direction = 1; // 下方向
                this.in_action_frame.move = COOL_TIME.move;
                this.check_movability(); // 下方向に移動可能かどうか確かめる
            }
            else if(key.is_a_pressed){
                this.direction = 2; // 左方向
                this.in_action_frame.move = COOL_TIME.move;
                this.check_movability(); // 左方向に移動可能かどうか確かめる
            }
            else if(key.is_d_pressed){
                this.direction = 3; // 右方向
                this.in_action_frame.move = COOL_TIME.move;
                this.check_movability(); // 右方向に移動可能かどうか確かめる
            }
        }

        // 攻撃アクション中でなければ、操作を受け付ける
        if(this.in_action_frame.attack <= 0){
            if(key.is_enter_pressed){
                this.in_action_frame.attack = COOL_TIME.attack; // 攻撃クールタイムがある
            }
        }
    }

    // 進もうとしている方向に進めるかどうか確かめる
    // 進めない例: 移動しようとしている方向に、移動できない床がある場合など。
    // 進めない場合、ここで、in_action_frame.move を 0 にすることで、移動を中止する
    // control メソッド から呼び出される
    check_movability(){
        // 現在プレイヤーが居るマップ
        let current_map = world_map()[this.world_map_x][this.world_map_y].map_data;
        let player_x = this.x - OFFSET; // プレイヤーの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
        let player_y = this.y - OFFSET; // プレイヤーの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0

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
    // game.js の メインループから呼び出される
    action(img, enemies){
        this.move(img, enemies);
        this.attack();
        this.damaged();
    }

    // 弓矢とプレイヤーキャラを実際に動かす。
    // 弓矢は問答無用で動くが、プレイヤーキャラは、in_action_frame.move が 1 以上のときに移動する
    // action メソッドから呼び出される
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
            // 足跡を追加する
            this.add_foot_print();
            // アニメーションを 1 動かす(0 なら 1 に。1 なら 0 に)
            this.animation_frame = (this.animation_frame + 1) % 2;
        }

        // マップ移動処理
        this.check_map_change(img, enemies);

        // 階段でのマップ移動処理
        this.check_map_change_by_stairs(img, enemies);
    }

    // プレイヤーの攻撃命令 を受けて、弓矢を生成する
    // action メソッドから呼び出される
    attack(){
        // アクションが終了したら、動作は行わない
        if(this.in_action_frame.attack <= 0) return;

        // 攻撃命令を受け付けたその時だけ弓矢を生成
        if(this.in_action_frame.attack == COOL_TIME.attack){
            let arrow = new Arrow(this.x, this.y, this.direction, this.img.arrow);
            this.arrows.push(arrow);
        }

        // 攻撃フレームを 1 進める
        this.in_action_frame.attack--;
    }

    // 被ダメージ処理
    // ダメージを受けたらプレイヤーキャラを点滅させる
    // action メソッドから呼び出される
    damaged(){
        // 無敵時間が終了したら、無敵時間経過は行わない
        if(this.in_action_frame.damaged <= 0) return;

        // 被ダメージフレームを 1 進める
        this.in_action_frame.damaged--;

        // in_action_frame.damaged が 2 フレーム進むごとに、色をオレンジと青で交互に変える
        // 0 フレーム ... 青
        // 1 ~ 2  フレーム ... オレンジ
        // 3 ~ 4  フレーム ... 青
        // 5 ~ 6  フレーム ... オレンジ
        // 7 ~ 8 フレーム ... 青
        // ...
        const CHANGE_COLOR_FRAME = 2;   // 何フレームごとに色を変えるか
        if(Math.ceil(this.in_action_frame.damaged / CHANGE_COLOR_FRAME) % 2 == 0) this.color = COLOR.blue;
        if(Math.ceil(this.in_action_frame.damaged / CHANGE_COLOR_FRAME) % 2 == 1) this.color = COLOR.orange;
    }

    // 描画処理
    // game.js の メインループから呼び出される
    draw(canvas, context, tile_size_in_canvas){
        // 弓矢の描画
        for(let arrow of this.arrows){
            arrow.draw(canvas, context, tile_size_in_canvas);
        }

        // プレイヤー自身の描画
        let player_img;
        // 色の確定
        if(this.color == COLOR.blue) player_img = this.img.blue;
        if(this.color == COLOR.orange) player_img = this.img.orange;

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
            INSIDE_WIDTH * (this.status.hp / this.max_hp),
            INSIDE_HEIGHT,
        );
    }

    // ダメージを受ける処理。
    // NOTE: ダメージ発生時に敵クラスから呼び出す
    is_damaged(damage, frame){
        // もし、無敵時間中なら、ダメージは発生しない
        if(this.in_action_frame.damaged > 0) return;

        // HP を ダメージ数分減らす
        this.status.hp -= damage;

        // 死亡判定
        // ダメージを受けた結果、HP が 0 になったら、ゲームオーバー処理
        if(this.status.hp <= 0){
            this.status.hp = 0;                    // HP が マイナスの値にならないように、0に調整。
            console.log("ゲームオーバー");
        }

        // 無敵時間を付与
        this.in_action_frame.damaged = frame;
    }

    // 足跡の追加処理
    // move メソッドから呼ばれる
    add_foot_print(){
        let player_x = this.x - OFFSET; // プレイヤーの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
        let player_y = this.y - OFFSET; // プレイヤーの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
        
        // 足跡を追加
        this.foot_print.push(
            {
                x: player_x,
                y: player_y,
            }
        );

        // 足跡が100個を超えたら、古いものから削除していく
        if(this.foot_print.length > 100) delete_one(this.foot_print, this.foot_print[0]);
    }

    // マップ移動処理
    // move メソッドから呼ばれる
    check_map_change(img, enemies){
        if(this.x < 0){
            this.x += FIELD_SIZE_IN_SCREEN;
            this.world_map_x--;
            this.execute_common_process_by_map_change(img, enemies);
        }
        if(this.x > FIELD_SIZE_IN_SCREEN){
            this.x -= FIELD_SIZE_IN_SCREEN;
            this.world_map_x++;
            this.execute_common_process_by_map_change(img, enemies);
        }
        if(this.y < 0){
            this.y += FIELD_SIZE_IN_SCREEN;
            if(change_map_from_map_x0_y1_to_map_x0_y0(this.world_map_x, this.world_map_y, this.foot_print) == false) return; // マップ[0][1] から ラスボスの城のあるマップ[0][0]に行くときの謎要素の追加
            this.world_map_y--;
            this.execute_common_process_by_map_change(img, enemies);
        }
        if(this.y > FIELD_SIZE_IN_SCREEN){
            this.y -= FIELD_SIZE_IN_SCREEN;
            this.world_map_y++;
            this.execute_common_process_by_map_change(img, enemies);
        }
    }

    // 階段でのマップ移動処理
    // move メソッドから呼ばれる
    // 昇り階段の座標とプレイヤーキャラの
    // ワールドマップ上の座標と、マップ上の座標が一致したら、下り階段の座標にワープする
    // 下り階段の座標とプレイヤーキャラの
    // ワールドマップ上の座標と、マップ上の座標が一致したら、昇り階段の座標にワープする
    check_map_change_by_stairs(img, enemies){
        for(let change_map_by_stair of change_map_by_stairs_list()){
            // 昇り階段から下り階段へのワープ
            if(
                this.x == change_map_by_stair.ascending.x + OFFSET &&
                this.y == change_map_by_stair.ascending.y + OFFSET &&
                this.world_map_x == change_map_by_stair.ascending.world_map_x &&
                this.world_map_y == change_map_by_stair.ascending.world_map_y
            ){
                this.x = change_map_by_stair.descending.x + OFFSET;
                this.y = change_map_by_stair.descending.y + OFFSET;
                this.world_map_x = change_map_by_stair.descending.world_map_x;
                this.world_map_y = change_map_by_stair.descending.world_map_y;
                this.execute_common_process_by_map_change(img, enemies);
            }
            // 下り階段から昇り階段へのワープ
            else if(
                this.x == change_map_by_stair.descending.x + OFFSET &&
                this.y == change_map_by_stair.descending.y + OFFSET &&
                this.world_map_x == change_map_by_stair.descending.world_map_x &&
                this.world_map_y == change_map_by_stair.descending.world_map_y
            ){
                this.x = change_map_by_stair.ascending.x + OFFSET;
                this.y = change_map_by_stair.ascending.y + OFFSET;
                this.world_map_x = change_map_by_stair.ascending.world_map_x;
                this.world_map_y = change_map_by_stair.ascending.world_map_y;
                this.execute_common_process_by_map_change(img, enemies);
            }
        }
    }

    // マップ移動の際に行われる共通処理
    // - 弓矢の消去
    // - 移動前のマップの敵の全消去
    // - 移動先のマップの敵の生成
    execute_common_process_by_map_change(img, enemies){
        delete_all(this.arrows); // 弓矢を全て消す
        delete_all(this.foot_print); // 足跡を全て消す 
        delete_all(enemies); // 現在のマップにいる敵を全て消す
        generate_enemies(this.world_map_x, this.world_map_y, img, enemies); // 移動先のマップに生息している敵キャラを生み出す
    }
}