// 炎の描画

export function draw_fires(canvas, context, tile_size_in_canvas){
    for(let fire of this.fires){
        fire.draw(canvas, context, tile_size_in_canvas);
    }
}