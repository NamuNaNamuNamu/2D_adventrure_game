/* プレイヤーキャラクターを表すクラス */

// 01_control
import { check_movability } from "../z0_common_methods/check_movability.js";

// 02_action
import { move } from "./methods/02_action/move.js";
import { execute_common_process_by_map_change } from "./methods/02_action/move/common_function/execute_common_process_by_map_change.js";
import { add_foot_print } from "./methods/02_action/move/add_foot_print.js";
import { check_map_change } from "./methods/02_action/move/check_map_change.js";
import { check_map_change_by_stairs } from "./methods/02_action/move/check_map_change_by_stairs.js";

import { attack } from "./methods/02_action/attack.js";
import { damaged } from "./methods/02_action/damaged.js";

// 03_draw
import { draw_arrows } from "./methods/03_draw/draw_arrows.js";
import { draw_hp_bar } from "./methods/03_draw/draw_hp_bar.js";
import { draw_myself } from "./methods/03_draw/draw_myself.js";

// その他
import { include } from "../../../global_function/include.js";
import { ExpandedArray } from "../../../global_class/expanded_array.js";
import { is_damaged } from "./methods/is_damaged.js";

const HIT_BOX = {  // プレイヤーキャラの当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.6,    // 横幅
    height: 0.6,   // 縦幅
}
export const COOL_TIME = { // それぞれの行動のクールタイム
    move: 3,        // 移動クールタイム（1歩で 3 フレーム費やす）
    attack: 10      // 攻撃クールタイム
}
export const COLOR = {
    blue: 0,       // 青 
    orange: 1,     // オレンジ
}
const MAP_CHIP_WHICH_CANNOT_MOVE_ON = [ // プレイヤーが移動できない床
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
    constructor(x, y, world_map_x, world_map_y, img, hp, atk){
        this.x = x;                             // x 座標(タイル基準 = 一番左が 0, 一番右が 16), プレイヤーの画像の中心の座標とする
        this.y = y;                             // y 座標(タイル基準 = 一番上が 0, 一番下が 16), プレイヤーの画像の中心の座標とする
        this.world_map_x = world_map_x;         // 現在プレイヤーがいる ワールドマップの x 座標
        this.world_map_y = world_map_y;         // 現在プレイヤーがいる ワールドマップの y 座標
        this.width = HIT_BOX.width;             // プレイヤーの当たり判定の横幅
        this.height = HIT_BOX.height;           // プレイヤーの当たり判定の縦幅
        this.img = img;                         // 写真 (front: 正面, back: 背面, left: 左, right: 右)
        this.direction = 0;                     // 身体の向き (0: 背面(上), 1: 正面(下), 2: 左, 3: 右)
        this.color = COLOR.blue;                // 色 (0: 青, 1: オレンジ)
        this.foot_print = new ExpandedArray();  // 1 マップ上での足跡（移動した軌跡）
        this.animation_frame = 0;               // 写真のアニメーション (0 と 1 を交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                            // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                          // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
            damaged: 0,                         // 被ダメージフレーム数。一回ダメージを受けたら、このフレーム分は無敵。
        };
        this.max_hp = hp;                       // 最大HP
        this.status = {
            hp: hp,                             // HP
            atk: atk,                           // 攻撃力
        }
        this.arrows = new ExpandedArray();      // 放った弓矢
    }

    // プレイヤーの操作を反映
    // game.js の メインループから呼び出される
    // direction と、in_action_frame.move, in_action_frame.attack を変更し、行動の準備をする。
    control(key){
        const accept_movement_operation = () => {
            // クールタイム (移動) 中であれば、受け付けない
            if(this.in_action_frame.move > 0) return;

            // キーが押されてなければ、何もしない
            const no_keys_are_pressed = !(key.is_w_pressed || key.is_s_pressed || key.is_a_pressed || key.is_d_pressed);
            if(no_keys_are_pressed) return;

            const decide_direction_from_key_press = (key) => {
                const DIRECTION = {
                    up: 0,
                    down: 1,
                    left: 2,
                    right: 3
                }

                if(key.is_w_pressed) return DIRECTION.up;
                if(key.is_s_pressed) return DIRECTION.down;
                if(key.is_a_pressed) return DIRECTION.left;
                if(key.is_d_pressed) return DIRECTION.right;
            }
            this.direction = decide_direction_from_key_press(key);
            
            // 決めた方向に移動可能かどうか確かめる => 不可能なら、動作命令は解除 (this.in_action_frame.move を 0 に)
            if(check_movability(this.x, this.y, this.world_map_x, this.world_map_y, this.direction, MAP_CHIP_WHICH_CANNOT_MOVE_ON) == false) return;

            this.in_action_frame.move = COOL_TIME.move;
        }
        accept_movement_operation();

        const accept_attack_operation = () => {
            // クールタイム (攻撃) 中であれば、受け付けない
            if(this.in_action_frame.attack > 0) return;

            if(key.is_enter_pressed){
                this.in_action_frame.attack = COOL_TIME.attack;
            }
        }
        accept_attack_operation();
    }

    // 実際の動作処理を行う
    // game.js の メインループから呼び出される
    action(img, enemies){
        this.move(img, enemies);
        this.attack();
        this.damaged();
    }

    // 描画処理
    // game.js の メインループから呼び出される
    draw(canvas, context, tile_size_in_canvas){
        this.draw_arrows(canvas, context, tile_size_in_canvas);
        this.draw_myself(canvas, context, tile_size_in_canvas);
        this.draw_hp_bar(canvas, context, tile_size_in_canvas);
    }
}

// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。

// 02_action
include(Player, move);
include(Player, execute_common_process_by_map_change);
include(Player, add_foot_print);
include(Player, check_map_change);
include(Player, check_map_change_by_stairs);

include(Player, attack);
include(Player, damaged);

// 03_draw
include(Player, draw_arrows);
include(Player, draw_myself);
include(Player, draw_hp_bar);

// その他
include(Player, is_damaged);
