// ブラックドラゴン自身の描画

import { COLOR } from "../../black_dragon.js";

export function draw_myself(_canvas, context, tile_size_in_canvas){
    let enemy_img;
    // 色を画像に反映
    if(this.color == COLOR.original) enemy_img = this.img.original[this.animation_frame];
    else if(this.color == COLOR.damaged) enemy_img = this.img.damaged[this.animation_frame];

    context.drawImage(
        enemy_img, // img
        this.x * tile_size_in_canvas - tile_size_in_canvas * 1,  // dx (canvas の描画開始位置 x)
        this.y * tile_size_in_canvas - tile_size_in_canvas * 1,  // dy (canvas の描画開始位置 y)
        tile_size_in_canvas * 2,  // d_width (canvas の描画サイズ 横幅)
        tile_size_in_canvas * 2,  // d_height (canvas の描画サイズ 縦幅)
    );
}
