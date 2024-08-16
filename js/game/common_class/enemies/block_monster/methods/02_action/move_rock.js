// 岩を動かす
// action メソッドから呼び出される

export function move_rock(){
    for(let rock of this.rocks){
        rock.move(this.rocks);
    }
}