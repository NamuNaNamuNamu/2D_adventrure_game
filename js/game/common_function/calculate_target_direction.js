// 自身の x, y 座標 と 対象の x, y 座標から 相手に対する方向の x, y の比率を割り出す
// x^2 + y^2 の平方根が 1 になるように割り出す

export function calculate_target_direction(x, y, target_x, target_y){
    let vx = target_x - x;
    let vy = target_y - y;
    let number_to_divide = Math.sqrt(vx ** 2 + vy ** 2);
    return [vx / number_to_divide, vy / number_to_divide];
}