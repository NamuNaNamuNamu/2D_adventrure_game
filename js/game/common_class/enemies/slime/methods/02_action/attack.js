// 攻撃判定
// プレイヤーキャラと重なったら、ダメージを与える
// action メソッドから呼び出される

export function attack(player, tile_size_in_canvas){
    // TODO: この if 文は長すぎるので、「2 つのオブジェクトが重なっているかどうか」を判定するメソッドを作って、それを使う。
    if(
        player.x * tile_size_in_canvas + player.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5 &&
        this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 0.5 >= player.x * tile_size_in_canvas - player.width * tile_size_in_canvas * 0.5 &&
        player.y * tile_size_in_canvas + player.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 &&
        this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 >= player.y * tile_size_in_canvas - player.height * tile_size_in_canvas * 0.5
    ){
        const INVINCIBLE_FRAME = 30;
        player.is_damaged(this.status.atk, INVINCIBLE_FRAME);
    }
}