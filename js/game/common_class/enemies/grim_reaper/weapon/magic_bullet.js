import { is_overlapping_with } from "../../../z0_common_methods/is_overlapping_with.js";
import { include } from "../../../../../global_function/include.js";

/* しにがみが使う魔法弾クラス */
const MAGIC_BULLET_SPEED_COEFFICIENT = 0.60;    // 魔法弾のスピードの係数
const HIT_BOX = {   // 当たり判定 (タイル基準。すなわち 1 ならタイル1枚分)
    width: 0.5,    // 横幅
    height: 0.5,   // 縦幅
}

export class MagicBullet{
    constructor(x, y, direction, img){
        this.x = x;                         // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 矢の画像の中心の座標とする
        this.y = y;                         // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 矢の画像の中心の座標とする
        this.width = HIT_BOX.width;    // 魔法弾の当たり判定の横幅
        this.height = HIT_BOX.height;  // 魔法弾の当たり判定の縦幅
        this.direction = direction;         // 魔法弾の飛ぶ向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.img = img;                     // 写真
    }

    // 魔法弾の移動処理
    move(magic_bullets){
        if(this.direction == 0) this.y = Math.round((this.y - MINIMUM_STEP * MAGIC_BULLET_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 1) this.y = Math.round((this.y + MINIMUM_STEP * MAGIC_BULLET_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * MAGIC_BULLET_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * MAGIC_BULLET_SPEED_COEFFICIENT) * 100) / 100;

        // もし、場外に出たら、魔法弾を削除
        const outside_of_the_top_edge    = this.y < - HIT_BOX.height;
        const outside_of_the_bottom_edge = this.y > FIELD_SIZE_IN_SCREEN + HIT_BOX.height;
        const outside_of_the_left_edge   = this.x < - HIT_BOX.width;
        const outside_of_the_right_edge  = this.x > FIELD_SIZE_IN_SCREEN + HIT_BOX.width;
        const on_the_outside_of_the_map  = (outside_of_the_top_edge || outside_of_the_bottom_edge || outside_of_the_left_edge || outside_of_the_right_edge);

        if(on_the_outside_of_the_map){
            magic_bullets.delete(this);
         }
    }

    // 攻撃処理
    attack(player, damage, tile_size_in_canvas){
        if(this.is_overlapping_with(player, tile_size_in_canvas)){
            const INVINCIBLE_FRAME = 30;
            player.is_damaged(damage, INVINCIBLE_FRAME);
        }
    }

    // 魔法弾の描画処理
    draw(_canvas, context, tile_size_in_canvas){
        context.drawImage(
            this.img, // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}

// NOTE: クラス定義の下に配置しないと、Uncaught ReferenceError: Cannot access '***' before initialization のエラーが発生する。

// その他
include(MagicBullet, is_overlapping_with);
