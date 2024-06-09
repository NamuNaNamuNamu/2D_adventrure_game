// 重なっているかどうか

// 使い方:
// include して使う。(参照: js/global_function/include.js)
// include 元と、引数の object に以下のインスタンス変数が必要。
// - x
// - y
// - width
// - height

export function is_overlapping_with(object, tile_size_in_canvas){ 
    // <前提処理>
    error_check(this);
    error_check(object);

    // <本処理>
    return (
        object.x * tile_size_in_canvas + object.width * tile_size_in_canvas * 0.5 >= this.x * tile_size_in_canvas - this.width * tile_size_in_canvas * 0.5 &&
        this.x * tile_size_in_canvas + this.width * tile_size_in_canvas * 0.5 >= object.x * tile_size_in_canvas - object.width * tile_size_in_canvas * 0.5 &&
        object.y * tile_size_in_canvas + object.height * tile_size_in_canvas * 0.5 >= this.y * tile_size_in_canvas - this.height * tile_size_in_canvas * 0.5 &&
        this.y * tile_size_in_canvas + this.height * tile_size_in_canvas * 0.5 >= object.y * tile_size_in_canvas - object.height * tile_size_in_canvas * 0.5
    );
}

function error_check(object){
    let errors = [];
    if(object.x === undefined) errors.push("x");
    if(object.y === undefined) errors.push("y");
    if(object.width === undefined) errors.push("width");
    if(object.height === undefined) errors.push("height");

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

    return stringed_error + errors[last_index] + " is undefined."
}