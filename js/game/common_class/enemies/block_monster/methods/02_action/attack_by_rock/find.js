// 引数 object が視界に入ったかどうかを判定する
//
// 使い方:
// include して使う。(参照: js/global_function/include.js)
// 引数の object に以下のインスタンス変数が必要。
// - x
// - y

export function find(object) {
    // <前提処理>
    error_check_for_myself(this);
    error_check_for_object(object);

    // <本処理>
    const DIRECTION = {
        up: 0,
        down: 1,
        left: 2,
        right: 3
    }
    
    // 視野
    const FIELD_OF_VIEW = {
        width : 4, // 横幅　 (単位: マス)
        length: 8  // 奥行き (単位: マス)
    }

    if (this.direction == DIRECTION.up) {
        if (
            this.y > object.y &&
            Math.abs(this.y - object.y) <= FIELD_OF_VIEW.length &&
            Math.abs(this.x - object.x) <= FIELD_OF_VIEW.width
        ) return true;
    }

    if (this.direction == DIRECTION.down) {
        if (
            this.y < object.y &&
            Math.abs(this.y - object.y) <= FIELD_OF_VIEW.length &&
            Math.abs(this.x - object.x) <= FIELD_OF_VIEW.width
        ) return true;
    }

    if (this.direction == DIRECTION.left) {
        if (
            this.x > object.x &&
            Math.abs(this.x - object.x) <= FIELD_OF_VIEW.length &&
            Math.abs(this.y - object.y) <= FIELD_OF_VIEW.width
        ) return true;
    }

    if (this.direction == DIRECTION.right) {
        if (
            this.x < object.x &&
            Math.abs(this.x - object.x) <= FIELD_OF_VIEW.length &&
            Math.abs(this.y - object.y) <= FIELD_OF_VIEW.width
        ) return true;
    }

    return false;
}

function error_check_for_myself(myself){
    let errors = [];
    if(myself.x === undefined) errors.push("x");
    if(myself.y === undefined) errors.push("y");
    if(myself.direction === undefined) errors.push("direction");

    if(errors.length === 0) return;

    throw new Error(make_error_msg(errors));
}

function error_check_for_object(object){
    let errors = [];
    if(object.x === undefined) errors.push("x");
    if(object.y === undefined) errors.push("y");

    if(errors.length === 0) return;

    throw new Error(make_error_msg(errors));
}

function make_error_msg(errors){
    if(errors.length === 1){
        return errors[0] + " is undefined.";
    }

    const last_index = errors.length - 1;
    let stringed_error = "";

    for(let i = 0; i < last_index; i++){
        stringed_error += errors[i] + ", ";
    }

    return stringed_error + errors[last_index] + " are undefined."
}