// プレイヤー自身の描画

import { COLOR } from "../../player.js";

export function draw_myself(_canvas, context, tile_size_in_canvas){
    let player_img;

    // 色の確定
    if(this.color == COLOR.blue) player_img = this.img.blue;
    if(this.color == COLOR.orange) player_img = this.img.orange;

    // 方向の確定
    const DIRECTION = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    }

    if(this.direction == DIRECTION.up) player_img = player_img.back[this.animation_frame];
    if(this.direction == DIRECTION.down) player_img = player_img.front[this.animation_frame];
    if(this.direction == DIRECTION.left) player_img = player_img.left[this.animation_frame];
    if(this.direction == DIRECTION.right) player_img = player_img.right[this.animation_frame];

    context.drawImage(
        player_img, // img
        this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
        this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
        tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
        tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
    );
}
