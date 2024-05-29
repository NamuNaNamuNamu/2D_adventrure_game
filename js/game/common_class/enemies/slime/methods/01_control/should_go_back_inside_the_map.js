// マップの端に行ったら、マップ外に出ないように戻る
// control メソッド から呼び出される
// 戻る必要があるなら true を返す
// 必要がないなら false を返す

export function should_go_back_inside_the_map(){
    if(this.x <= 0){                            // 左にはみ出ようとしたら
        this.direction = 3;                     // 右に戻る
        return true;
    }
    else if(this.x >= FIELD_SIZE_IN_SCREEN){    // 右にはみ出ようとしたら
        this.direction = 2;                     // 左に戻る
        return true;
    }
    else if(this.y <= 0){                       // 上にはみ出ようとしたら
        this.direction = 1;                     // 下に戻る
        return true;
    }
    else if(this.y >= FIELD_SIZE_IN_SCREEN){    // 下にはみ出ようとしたら
        this.direction = 0;                     // 上に戻る
        return true;
    }

    return false;
}