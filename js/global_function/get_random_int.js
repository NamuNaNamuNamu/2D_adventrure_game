/* min 以上 max 以下のランダムな整数を返す */

// ex) random_num({min: 1, max: 100}) 1 以上 100 以下のランダムな整数
export function get_random_int(range){
    if(range.min == undefined || range.max == undefined){
        throw new Error("The argument must be dictionary and include \"max\" and \"min\" info as keys\nexample: random_num({min: 1, max: 100})");
    }

    const min_or_max_is_not_int = !Number.isInteger(range.min) || !Number.isInteger(range.max);
    if(min_or_max_is_not_int){
        throw new Error("\"min\" and \"max\" must be integer");
    }

    if(range.min > range.max){
        throw new Error("\"min\" must be smaller than \"max\"");
    }

    return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
}