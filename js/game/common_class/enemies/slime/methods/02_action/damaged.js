// ダメージ判定
// プレイヤーキャラの弓矢が重なったらダメージを受けて、当たった弓矢を消去
// action メソッドから呼び出される

const COLOR = {
    original: 0,    // 通常時の色 
    damaged: 1,     // 被ダメージ時の色
}

export function damaged(player, enemies, tile_size_in_canvas){
    // 弓矢が自分に当たったら
    for(let arrow of player.arrows){
        // TODO: この if 文は長すぎるので、「2 つのオブジェクトが重なっているかどうか」を判定するメソッドを作って、それを使う。
        if(
            arrow.x * tile_size_in_canvas + arrow.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5 &&
            this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 0.5 >= arrow.x * tile_size_in_canvas - arrow.width * tile_size_in_canvas * 0.5 &&
            arrow.y * tile_size_in_canvas + arrow.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 &&
            this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 >= arrow.y * tile_size_in_canvas - arrow.height * tile_size_in_canvas * 0.5
        ){
            // プレイヤーキャラの攻撃力分、敵キャラの体力を減らす
            this.is_damaged(player.status.atk, enemies, arrow, player.arrows);
        }
    }

    // ダメージアニメーションが終了したら、これ以降の処理はしない
    if(this.in_action_frame.damaged <= 0) return;

    // 被ダメージフレームを 1 進める
    this.in_action_frame.damaged--;

    // in_action_frame.damaged によって色を変える
    // 0 フレーム ... 通常色
    // 1 フレーム 以上 ... 被ダメージ時の色
    if(this.in_action_frame.damaged > 0) this.color = COLOR.damaged;
    else this.color = COLOR.original;
}