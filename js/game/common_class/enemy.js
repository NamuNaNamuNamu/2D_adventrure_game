/* 敵キャラ全てが継承する大元クラス */

import { world_map } from "./../common_function/world_map.js";
import { delete_one } from "../common_function/delete_one.js";

const COLOR = {
    original: 0,    // 通常時の色 
    damaged: 1,     // 被ダメージ時の色
}
const DAMAGED_COOL_TIME = 8; // 被ダメージのクールタイム (現時点では、身体の色がダメージを受けている時の色になる時間)

export class Enemy{
    constructor(x, y, world_map_x, world_map_y, width, height, img, map_chip_which_enemy_cannot_move_on, speed_coefficient, animation_order, status){
        this.x = x;                                                                     // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 敵キャラの画像の中心の座標とする
        this.y = y;                                                                     // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 敵キャラの画像の中心の座標とする
        this.world_map_x = world_map_x;                                                 // その敵キャラが生息する ワールドマップの x 座標
        this.world_map_y = world_map_y;                                                 // その敵キャラが生息する ワールドマップの y 座標
        this.width = width;                                                             // 敵キャラの横幅 (タイル基準。すなわち 1 ならタイル1枚分)
        this.height = height;                                                           // 敵キャラの縦幅 (タイル基準。すなわち 1 ならタイル1枚分)
        this.img = img;                                                                 // 写真 (original: 通常時, damaged: 被ダメージ時)
        this.map_chip_which_enemy_cannot_move_on = map_chip_which_enemy_cannot_move_on; // その敵キャラが移動できない床
        this.speed_coefficient = speed_coefficient;                                     // 移動スピード係数
        this.direction = 0;                                                             // 身体の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.color = COLOR.original;                                                    // 色(通常時: COLOR.original, 被ダメージ時: COLOR.damaged)
        this.animation_frame = 0;                                                       // 写真のアニメーション (0 と 1 と 2 と 3 を 交互に変えてアニメーションを実現する)
        this.animation_order = animation_order;                                         // アニメーションの流れ
        this.in_action_frame = {
            move: 0,                                                                    // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                                                                  // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
            damaged: 0,                                                                 // 被ダメージフレーム数。一回ダメージを受けたら、このフレーム分は無敵。
        };
        this.is_taking_a_break = false;                                                 // 行動しない状態かどうか
        this.status = status;                                                           // 敵キャラのステータス (hp, 攻撃力(atk))
    }

    // マップの端に行ったら、マップ外に出ないように戻る
    // control メソッド から呼び出される
    // 戻る必要があるなら true を返す
    // 必要がないなら false を返す
    stay_in_the_map(){
        if(this.x <= 0){                            // 左にはみ出ようとしたら
            this.direction = 3;                     // 右に戻る
            return true;
        }
        else if(this.x >= FIELD_SIZE_IN_SCREEN){    // 右にはみ出ようとしたら
            this.direction = 2;                     // 左に戻る
            return true;
        }
        else if(this.y <= 0){                       // 上にはみ出ようとしたら
            this.direction = 1;                     // 下に戻る
            return true;
        }
        else if(this.y >= FIELD_SIZE_IN_SCREEN){    // 下にはみ出ようとしたら
            this.direction = 0;                     // 上に戻る
            return true;
        }

        return false;
    }

    // 進もうとしている方向に進めるかどうか確かめる
    // control メソッド から呼び出される
    // is_blown_away メソッド からも呼び出される
    // 移動しようとしている方向に、移動できない床がある場合 false を返す
    // 移動できる場合は、true を返す
    check_movability(direction){
        let current_map = world_map()[this.world_map_x][this.world_map_y].map_data; // 現在敵キャラが居るマップ
        let enemy_x = this.x - 0.5; // 敵キャラの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
        let enemy_y = this.y - 0.5; // 敵キャラの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0

        // 上方向に移動しようとしている場合
        if(direction == 0){
            // 敵キャラが上下において、ぴったりタイルの上に乗っている場合、絶対上に一歩進めるので、チェックはスルー
            if(enemy_y % 1 == 0) return true;

            // もしマップの上端の場合、絶対上に一歩進めるので、チェックはスルー
            if(enemy_y <= 0) return true;
            
            let upper_left = { // 敵キャラの上の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
                x: Math.floor(enemy_x),
                y: enemy_y - 0.5,
            };
            let upper_right = { // 敵キャラの上の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真上の床を指す）
                x: Math.ceil(enemy_x),
                y: enemy_y - 0.5,
            };

            // 敵キャラの半歩上にある床が移動できない場合
            if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[upper_left.y][upper_left.x]) || 
            this.map_chip_which_enemy_cannot_move_on.includes(current_map[upper_right.y][upper_right.x])){
                return false;
            }
        }
        // 下方向に移動しようとしている場合
        if(direction == 1){
            // 敵キャラが上下において、ぴったりタイルの上に乗っていない場合、絶対下に一歩進めるので、チェックはスルー
            if(Math.abs((enemy_y) % 1) == 0.5) return true; // NOTE: -0.5 % 1 は 0.5 ではなく、-0.5 となってしまうので、絶対値を取って回避。

            // もしマップの下端の場合、絶対下に一歩進めるので、チェックはスルー
            if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) return true;

            let lower_left = { // 敵キャラの下の左側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
                x: Math.floor(enemy_x),
                y: enemy_y + 1,
            };
            let lower_right = { // 敵キャラの下の右側にある床（敵キャラが左右において、ぴったりタイルの上に乗っている場合、真下の床を指す）
                x: Math.ceil(enemy_x),
                y: enemy_y + 1,
            };
            
            // 敵キャラの 1歩下にある床が移動できない場合
            if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[lower_left.y][lower_left.x]) || 
            this.map_chip_which_enemy_cannot_move_on.includes(current_map[lower_right.y][lower_right.x])){
                return false;
            }
        }
        // 左方向に移動しようとしている場合
        if(direction == 2){
            // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対左に一歩進めるので、チェックはスルー
            if((enemy_x) % 1 == 0.5) return true;

            let left = { // 敵キャラの左の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真左の床を指す）
                x: enemy_x - 1,
                y: Math.ceil(enemy_y),
            };

            // もしマップの下端の場合、参照する床は敵キャラの左の上側にする
            if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) left.y = Math.floor(enemy_y);

            // 敵キャラの 1歩左にある床が移動できない場合
            if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[left.y][left.x])){
                return false;
            }
        }
        // 右方向に移動しようとしている場合
        if(direction == 3){
            // 敵キャラが左右において、ぴったりタイルの上に乗っていない場合、絶対右に一歩進めるので、チェックはスルー
            if((enemy_x) % 1 == 0.5) return true;

            let right = { // 敵キャラの右の下側にある床（敵キャラが上下において、ぴったりタイルの上に乗っている場合、真右の床を指す）
                x: enemy_x + 1,
                y: Math.ceil(enemy_y),
            };

            // もしマップの下端の場合、参照する床は敵キャラの右の上側にする
            if(enemy_y >= FIELD_SIZE_IN_SCREEN - 1) right.y = Math.floor(enemy_y);

            // 敵キャラの 1歩右にある床が移動できない場合
            if(this.map_chip_which_enemy_cannot_move_on.includes(current_map[right.y][right.x])){
                return false;
            }
        }
    }

    // 敵キャラを行動させる
    // game.js の メインループから呼び出される
    action(player, enemies, tile_size_in_canvas){
        this.move();
        this.attack(player, tile_size_in_canvas);
        this.damaged(player, enemies, tile_size_in_canvas);
    }

    // 敵キャラの移動処理
    // action メソッドから呼び出される
    // 1. MOVE_COOL_TIME ごとに、アニメーションを動かす
    // 2. MOVE_COOL_TIME ごとに、以下の挙動をする。
    //     2-1. is_taking_a_break が true の場合、動かない
    //     2-2. is_taking_a_break が false の場合、direction の方向 (0: 上, 1: 下, 2: 左, 3: 右) に動く
    move(){
        // アクションが終了したら、動作は行わない (次の動作命令に向けて待機)
        if(this.in_action_frame.move <= 0) return;

        const NUM_OF_ANIMATION_FLAME = 4;      // アニメーションの数 (4 フレーム 1 セットでアニメーションする)

        // 休憩じゃなければ移動する
        if(this.direction == 0 && !this.is_taking_a_break) this.y = Math.round((this.y - MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
        if(this.direction == 1 && !this.is_taking_a_break) this.y = Math.round((this.y + MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
        if(this.direction == 2 && !this.is_taking_a_break) this.x = Math.round((this.x - MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
        if(this.direction == 3 && !this.is_taking_a_break) this.x = Math.round((this.x + MINIMUM_STEP * this.speed_coefficient) * 100) / 100;
        
        // 動作フレームを 1 進める
        this.in_action_frame.move--;

        // MOVE_COOL_TIME に 1回 (in_action_frame.move が 0 になったとき) だけ、
        if(this.in_action_frame.move > 0) return;

        // 座標の誤差を補正する
        this.x = Math.round(this.x * 2) * 0.5;
        this.y = Math.round(this.y * 2) * 0.5;

        // アニメーションを動かす
        this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす

        // 休み状態を解消
        this.is_taking_a_break = false;
    }

    // 攻撃判定
    // プレイヤーキャラと重なったら、ダメージを与える
    // action メソッドから呼び出される
    attack(player, tile_size_in_canvas){
        if(
            player.x * tile_size_in_canvas + player.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5 &&
            this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 0.5 >= player.x * tile_size_in_canvas - player.width * tile_size_in_canvas * 0.5 &&
            player.y * tile_size_in_canvas + player.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 &&
            this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 >= player.y * tile_size_in_canvas - player.height * tile_size_in_canvas * 0.5
        ){
            const INVINCIBLE_FRAME = 30;
            player.is_damaged(this.status.atk, INVINCIBLE_FRAME);
        }
    }

    // ダメージ判定
    // プレイヤーキャラの弓矢が重なったらダメージを受けて、当たった弓矢を消去
    // action メソッドから呼び出される
    damaged(player, enemies, tile_size_in_canvas){
        // 弓矢が自分に当たったら
        for(let arrow of player.arrows){
            if(
                arrow.x * tile_size_in_canvas + arrow.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5 &&
                this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 0.5 >= arrow.x * tile_size_in_canvas - arrow.width * tile_size_in_canvas * 0.5 &&
                arrow.y * tile_size_in_canvas + arrow.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 &&
                this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 >= arrow.y * tile_size_in_canvas - arrow.height * tile_size_in_canvas * 0.5
            ){
                // プレイヤーキャラの攻撃力分、敵キャラの体力を減らす
                this.is_damaged(player.status.atk, enemies, arrow, player.arrows);
            }
        }

        // ダメージアニメーションが終了したら、これ以降の処理はしない
        if(this.in_action_frame.damaged <= 0) return;

        // 被ダメージフレームを 1 進める
        this.in_action_frame.damaged--;

        // in_action_frame.damaged によって色を変える
        // 0 フレーム ... 通常色
        // 1 フレーム 以上 ... 被ダメージ時の色
        if(this.in_action_frame.damaged > 0) this.color = COLOR.damaged;
        else this.color = COLOR.original;
    }

    // 描画処理
    // game.js の メインループから呼び出される
    draw(canvas, context, tile_size_in_canvas){
        const TOP_LEFT_CORNER_AXIS = {          // マップチップ本体の左上端
            x: 0,
            y: 0,
        };
        const TILE = {
            width: 32,  // マップチップ画像上でのマップチップ 1つ分の幅
            height: 32, // マップチップ画像上でのマップチップ 1つ分の幅
        };
        const DIRECTION_ORDER = [3, 0, 1, 2]; // 向きと写真の順番を合わせるための配列
        const MARGIN_LEFT = 6;
        const MARGIN_RIGHT = 6;
        const MARGIN_TOP = 12;
        const MARGIN_BOTTOM = 0;

        let enemy_img;
        // 色を画像に反映
        if(this.color == COLOR.original) enemy_img = this.img.original;
        else if(this.color == COLOR.damaged) enemy_img = this.img.damaged;

        context.drawImage(
            enemy_img, // img
            TOP_LEFT_CORNER_AXIS.x + MARGIN_LEFT + this.animation_order[this.animation_frame] * TILE.width,  // sx (元画像の切り抜き始点 x)
            TOP_LEFT_CORNER_AXIS.y + MARGIN_TOP + DIRECTION_ORDER[this.direction] * TILE.height,  // sy (元画像の切り抜き始点 y)
            TILE.width - (MARGIN_LEFT + MARGIN_RIGHT),  // s_width (元画像の切り抜きサイズ 横幅)
            TILE.height - (MARGIN_TOP + MARGIN_BOTTOM),  // s_height (元画像の切り抜きサイズ 縦幅)
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }

    // ダメージを受ける処理。
    // NOTE: ダメージ発生時に damaged メソッドから呼び出される
    is_damaged(damage, enemies, arrow, arrows){
        // HP を ダメージ数分減らす
        this.status.hp -= damage;
        // 被ダメージフレームをリセットする (プレイヤーキャラと違って無敵時間は付与しない)
        this.in_action_frame.damaged = DAMAGED_COOL_TIME;
        // 当たった弓矢を消去
        arrows.splice(arrows.indexOf(arrow), 1);

        // 死亡判定
        // ダメージを受けた結果、HP が 0 になったら、自分を消滅させる。
        if(this.status.hp <= 0){
            delete_one(enemies, this);
            return;
        }

        // 弓矢を当てられた方向と逆に吹っ飛ばされる
        this.is_blown_away(arrow);
    }

    // ダメージを受けたときに吹っ飛ばされる処理
    // ただし、以下の場合は例外。
    // 1. マップ外に出るように吹っ飛ばされた場合、何も起きない
    // 2. 移動中の場合、何も起きない
    // 3. 吹っ飛ばされる方向が移動できない床だった場合、何も起きない
    // is_damaged メソッドから呼ばれる
    is_blown_away(arrow){
        // 1. マップ外に出るように吹っ飛ばされた場合、何も起きない
        if(this.x <= 0 && arrow.direction == 2 ||
        this.x >= FIELD_SIZE_IN_SCREEN && arrow.direction == 3 ||
        this.y <= 0 && arrow.direction == 0 ||
        this.y >= FIELD_SIZE_IN_SCREEN && arrow.direction == 1){
            return;
        }

        // 2. 移動中の場合、何も起きない
        if(this.in_action_frame.move != 0 && !(this.is_taking_a_break)) return;

        // 3. 吹っ飛ばされる方向が移動できない床だった場合、何も起きない
        if(this.check_movability(arrow.direction) == false) return;

        // 吹っ飛ばされる (MINIMUM_STEP 分)
        if(arrow.direction == 0) this.y -= MINIMUM_STEP;
        if(arrow.direction == 1) this.y += MINIMUM_STEP;
        if(arrow.direction == 2) this.x -= MINIMUM_STEP;
        if(arrow.direction == 3) this.x += MINIMUM_STEP;
    }
}