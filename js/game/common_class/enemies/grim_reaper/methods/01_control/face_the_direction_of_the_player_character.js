// プレイヤーキャラのいる方向を向く
// control メソッドから呼び出される

export function face_the_direction_of_the_player_character(player){
    // まず、プレイヤーキャラのいる位置 から 自分のいる位置を引く
    let x_diff = player.x - this.x;
    let y_diff = player.y - this.y;

    // 全く同じ位置にいる場合は、動かなくていい
    if(x_diff == 0 && y_diff == 0){ 
        this.is_taking_a_break = true;
        return;
    }

    // x 方向 の方が距離の差がある場合 (x 方向 と y 方向 の距離の差が同じ場合も含む)
    if(Math.abs(x_diff) >= Math.abs(y_diff)){
        // プレイヤーキャラが自分から見て左にいるなら左を向く
        if(x_diff < 0) this.direction = 2;
        // プレイヤーキャラが自分から見て右にいるなら右を向く
        else this.direction = 3;
    }
    // y 方向 の方が距離の差がある場合
    else{
        // プレイヤーキャラが自分から見て上にいるなら上を向く
        if(y_diff < 0) this.direction = 0;
        // プレイヤーキャラが自分から見て下にいるなら下を向く
        else this.direction = 1;
    }
}