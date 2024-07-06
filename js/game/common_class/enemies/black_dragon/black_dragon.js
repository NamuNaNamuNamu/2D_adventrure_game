/* ブラックドラゴンクラス */

// 01_control

// 02_action
import { move } from "./methods/02_action/move.js";
import { attack } from "./methods/02_action/attack.js";
import { attack_by_fire } from "./methods/02_action/attack_by_fire.js";
import { protected_ } from "./methods/02_action/protected.js";
import { damaged } from "./methods/02_action/damaged.js";
import { is_damaged } from "../../z0_common_methods/02_action/damaged/is_damaged.js";

// 03_draw
import { draw_fires } from "./methods/03_draw/draw_fires.js";
import { draw_myself } from "./methods/03_draw/draw_myself.js";
import { draw_hp_bar } from "./methods/03_draw/draw_hp_bar.js";

// その他
import { is_overlapping_with } from "../../z0_common_methods/is_overlapping_with.js";
import { include } from "../../../../global_function/include.js";
import { ExpandedArray } from "../../../../global_class/expanded_array.js";

const HIT_BOX = {   // ブラックドラゴンの当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.35,    // 横幅
    height: 0.35,   // 縦幅
}
export const COOL_TIME = { // それぞれの行動のクールタイム
    move: 24,        // 移動クールタイム（1歩で 24フレーム費やす）
    attack: 20,      // 攻撃クールタイム
}
export const COLOR = {
    original: 0,    // 通常時の色 
    damaged: 1,     // 被ダメージ時の色
}
const SPEED_COEFFICIENT = 0.083;        // ブラックドラゴンのスピードの係数
export const ANIMATION_ORDER = [0, 1];  // アニメーションの流れ

export class BlackDragon {
    constructor(x, y, world_map_x, world_map_y, img, status){
        this.x = x;                                                            // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 敵キャラの画像の中心の座標とする
        this.y = y;                                                            // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 敵キャラの画像の中心の座標とする
        this.world_map_x = world_map_x;                                        // その敵キャラが生息する ワールドマップの x 座標
        this.world_map_y = world_map_y;                                        // その敵キャラが生息する ワールドマップの y 座標
        this.width = HIT_BOX.width;                                                     // 敵キャラの当たり判定の横幅 (タイル基準。すなわち 1 ならタイル1枚分)
        this.height = HIT_BOX.height;                                                   // 敵キャラの当たり判定の縦幅 (タイル基準。すなわち 1 ならタイル1枚分)
        this.img = img;                                                                 // 写真 (original: 通常時, damaged: 被ダメージ時)
        this.speed_coefficient = SPEED_COEFFICIENT;                                     // 移動スピード係数
        this.direction = 0;                                                             // 身体の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.color = COLOR.original;                                                    // 色(通常時: COLOR.original, 被ダメージ時: COLOR.damaged)
        this.animation_frame = 0;                                                       // 写真のアニメーション (0 と 1 と 2 と 3 を 交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                                                                    // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
            attack: 0,                                                                  // 攻撃フレーム数。一回攻撃したら、このフレーム分は攻撃操作出来ない
            damaged: 0,                                                                 // 被ダメージフレーム数。一回ダメージを受けたら、このフレーム分は無敵。
        };
        this.is_taking_a_break = false;                                                 // 行動しない状態かどうか
        this.status = status;                                                           // 敵キャラのステータス (hp, 攻撃力(atk))

        this.max_hp = status.hp; // 最大HP
        this.fires = new ExpandedArray(); // 放った炎
    }

    control(_player){
        // 行動中であれば、受け付けない
        if(this.in_action_frame.move > 0) return;

        // クールタイムをリセット
        this.in_action_frame.move = COOL_TIME.move;

        // 左に歩いたら右に。右に歩いたら今度は左に動く
        // 2: 左, 3: 右
        this.direction == 2 ? this.direction = 3 : this.direction = 2;
    }

    action(player, enemies, tile_size_in_canvas){
        this.move();
        this.attack(player, tile_size_in_canvas);
        this.attack_by_fire(player, tile_size_in_canvas);

        // 被ダメージ系
        this.protected_(player, tile_size_in_canvas);
        this.damaged(player, enemies, tile_size_in_canvas);
    }

    draw(canvas, context, tile_size_in_canvas){
        this.draw_fires(canvas, context, tile_size_in_canvas);
        this.draw_myself(canvas, context, tile_size_in_canvas);
        this.draw_hp_bar(canvas, context, tile_size_in_canvas);

        //////
        // // デバッグ用。当たり判定を四角形で描画する
        // // 無効判定(上半身)
        // context.fillStyle = "rgb(255, 100, 100)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 2.5,
        //     this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 2.5,
        //     this.width * tile_size_in_canvas * 5,
        //     this.height * tile_size_in_canvas * 2,
        // );

        // // 無効判定(下半身)
        // context.fillStyle = "rgb(255, 100, 100)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 2.5,
        //     this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5,
        //     this.width * tile_size_in_canvas * 5,
        //     this.height * tile_size_in_canvas * 2,
        // );

        // // 体当たりによる攻撃判定
        // context.fillStyle = "rgb(100, 100, 255)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 1.5,
        //     this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 2.5,
        //     this.width * tile_size_in_canvas * 3,
        //     this.height * tile_size_in_canvas * 4,
        // );

        // // ダメージ判定
        // context.fillStyle = "rgb(255, 255, 255)";
        // context.fillRect(
        //     this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5,
        //     this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5,
        //     this.width * tile_size_in_canvas,
        //     this.height * tile_size_in_canvas,
        // );
        //////
    }
}

// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。

// 01_control


// 02_action
include(BlackDragon, move);
include(BlackDragon, attack);
include(BlackDragon, attack_by_fire);
include(BlackDragon, protected_);
include(BlackDragon, damaged);
include(BlackDragon, is_damaged);

// 03_draw
include(BlackDragon, draw_fires);
include(BlackDragon, draw_myself);
include(BlackDragon, draw_hp_bar);

// その他
include(BlackDragon, is_overlapping_with);
