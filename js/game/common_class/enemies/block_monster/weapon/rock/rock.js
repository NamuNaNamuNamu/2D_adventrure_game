/* ブロックモンスターが使う岩クラス */

import { is_overlapping_with } from "../../../../z0_common_methods/is_overlapping_with.js";
import { include } from "../../../../../../global_function/include.js";

const GAP = 30; // プレイヤーキャラの 30 マス上から放つ。1 フレームごとに 0.5 マス 進むので、60 フレーム後にプレイヤーキャラの元に届く
const INITIAL_IN_ACTION_FRAME = {
    broken: 12
};
const SPEED_COEFFICIENT = 1; // 1 フレームで 1 MINIMUM_STEP = 0.5 マス進む
const HIT_BOX = {   // 当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.5,    // 横幅
    height: 0.5,   // 縦幅
}

export class Rock {
    constructor(x, y, img){      
        this.x = x;                         // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 岩の画像の中心の座標とする
        this.y = y - GAP;                   // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 岩の画像の中心の座標とする
        this.width = HIT_BOX.width;         // 岩の当たり判定の横幅
        this.height = HIT_BOX.height;       // 岩の当たり判定の縦幅
        this.img = img;                     // 写真
        this.shadow = {
            x: x,
            y: y,
        }
        this.in_action_frame = {
            broken: 0                       // 岩が壊れるアニメーションのために使う
        };
        this.is_broken = false;             // 岩が壊れている最中かどうか
    }

    // 岩の移動処理
    move(rocks) {
        if (this.in_action_frame.broken > 0 && this.is_broken) {
            this.in_action_frame.broken--;
            if (this.in_action_frame.broken <= 0 && this.is_broken) {
                rocks.delete(this);
            }
            return;
        }

        this.y = Math.round((this.y + MINIMUM_STEP * SPEED_COEFFICIENT) * 100) / 100;

        if (this.y >= this.shadow.y) {
            this.in_action_frame.broken = INITIAL_IN_ACTION_FRAME.broken;
            this.is_broken = true;
        }
    }

    // 攻撃処理
    attack(player, damage, tile_size_in_canvas) {
        if (this.in_action_frame.broken == 0) return;

        if(this.is_overlapping_with(player, tile_size_in_canvas)){
            const INVINCIBLE_FRAME = 30;
            player.is_damaged(damage, INVINCIBLE_FRAME);
        }
    }

    // 描画処理
    draw(_canvas, context, tile_size_in_canvas){
        // 自身の描画
        // 影の地点についたあとは、壊れる描写をアニメーションする
        let rock_img;
        if (this.is_broken) {
            const get_broken_rock_img = (rock_images) => {
                // this.in_action_frame.broken が 12 ~ 9 ... 壊れた岩の写真 1 枚目
                // this.in_action_frame.broken が  8 ~ 5 ... 壊れた岩の写真 2 枚目
                // this.in_action_frame.broken が  4 ~ 1 ... 壊れた岩の写真 3 枚目

                const num_of_broken_rock_img = rock_images.length - 1; // 全写真 - 壊れる前の岩の写真 1 枚
                const index = num_of_broken_rock_img + 1 - Math.ceil(this.in_action_frame.broken * (num_of_broken_rock_img / INITIAL_IN_ACTION_FRAME.broken));
                return rock_images[index];
            }

            rock_img = get_broken_rock_img(this.img.rock);
        }
        else {
            rock_img = this.img.rock[0];
        }

        context.drawImage(
            rock_img, // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );

        // 影の描画
        // 岩の y 座標と影の y 座標の差分を見て、影の大きさを決めて描画する
        let shadow_img;
        if      (this.shadow.y - this.y > GAP - (GAP / 30) * 1) shadow_img = this.img.shadow[0];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 6) shadow_img = this.img.shadow[1];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 11) shadow_img = this.img.shadow[2];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 15) shadow_img = this.img.shadow[3];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 19) shadow_img = this.img.shadow[4];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 23) shadow_img = this.img.shadow[5];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 27) shadow_img = this.img.shadow[6];
        else if (this.shadow.y - this.y > GAP - (GAP / 30) * 30) shadow_img = this.img.shadow[7];
        else {
            return;
        }

        const ADJUSTMENT = 0.3; // NOTE: 主人公の足元に影を描画するために座標をずらす
        context.drawImage(
            shadow_img, // img
            this.shadow.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            (this.shadow.y + ADJUSTMENT) * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}

// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。

// その他
include(Rock, is_overlapping_with);
