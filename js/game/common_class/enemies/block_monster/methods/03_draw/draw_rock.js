// 魔法弾の描画

export function draw_rock(canvas, context, tile_size_in_canvas){
    for(let rock of this.rocks){
        rock.draw(canvas, context, tile_size_in_canvas);
    }
}