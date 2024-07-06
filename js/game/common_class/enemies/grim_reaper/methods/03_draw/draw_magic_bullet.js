// 魔法弾の描画

export function draw_magic_bullet(canvas, context, tile_size_in_canvas){
    for(let magic_bullet of this.magic_bullets){
        magic_bullet.draw(canvas, context, tile_size_in_canvas);
    }
}