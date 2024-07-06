// 攻撃判定
// プレイヤーキャラと重なったら、ダメージを与える
// action メソッドから呼び出される

export function attack(player, tile_size_in_canvas){
    const hit_box = {x: this.x, y: this.y - 0.5 * this.height, width: this.width * 3, height: this.height * 4};
    if(player.is_overlapping_with(hit_box, tile_size_in_canvas)){
        const INVINCIBLE_FRAME = 30;
        player.is_damaged(this.status.atk, INVINCIBLE_FRAME);
    }
}