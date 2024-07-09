// 弓矢の描画

export function draw_arrows(canvas, context, tile_size_in_canvas){
    for(let arrow of this.arrows){
        arrow.draw(canvas, context, tile_size_in_canvas);
    }
}