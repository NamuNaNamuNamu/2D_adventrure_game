// 魔法弾を動かす
// action メソッドから呼び出される

export function move_magic_bullet(){
    for(let magic_bullet of this.magic_bullets){
        magic_bullet.move(this.magic_bullets);
    }
}