// 足跡の追加処理
// move メソッドから呼ばれる

export function add_foot_print(){
    let player_x = this.x - OFFSET; // プレイヤーの x 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
    let player_y = this.y - OFFSET; // プレイヤーの y 座標を配列のインデックスになるように調整。一番左上のタイルの真上に経っていた場合、0
    
    // 足跡を追加
    this.foot_print.push(
        {
            x: player_x,
            y: player_y,
        }
    );

    // 足跡が100個を超えたら、古いものから削除していく
    if(this.foot_print.length > 100) this.foot_print.delete(this.foot_print[0]);
}