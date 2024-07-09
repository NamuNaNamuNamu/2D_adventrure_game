// 弱点以外のところに当たった弓矢を消去
// action メソッドから呼び出される

// NOTE: protected は予約語なので、最後に "_" を付けてエラーを回避する。
export function protected_(player, tile_size_in_canvas){
    // 自分の弓矢が弱点じゃない部分に当たったら
    for(let arrow of player.arrows){
        const upper_half = {x: this.x, y: this.y - 1.5 * this.height, width: this.width * 5, height: this.height * 2}; // TODO: もっといい名前を考える
        const lower_half = {x: this.x, y: this.y + 1.5 * this.height, width: this.width * 5, height: this.height * 2}; // TODO: もっといい名前を考える
        if(
            // 上半分
            arrow.is_overlapping_with(upper_half, tile_size_in_canvas) ||
            // 下半分
            arrow.is_overlapping_with(lower_half, tile_size_in_canvas)
        ){
            // 当たった弓矢を消去するだけ
            player.arrows.delete(arrow);
        }
    }
}
