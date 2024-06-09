// 敵キャラの移動処理
// action メソッドから呼び出される
// 魔法弾を動かす

export function move_magic_bullet(){
    for(let magic_bullet of this.magic_bullets){
        magic_bullet.move(this.magic_bullets);
    }
}