/* 階段によるマップ移動を定義する関数 */

export function change_map_by_stairs_list(){
    /*
    配列の 1 要素は、昇りと下り階段の 1 セットを表している
    昇り階段の座標とプレイヤーキャラの座標が一致したら、下り階段の座標にワープする
    下り階段の座標とプレイヤーキャラの座標が一致したら、昇り階段の座標にワープする
    */

    return [
        {
            // 昇り階段
            ascending: {
                x: 8,
                y: 14,
                world_map_x: 2,
                world_map_y: 14,
            },
            // 下り階段
            descending: {
                x: 9,
                y: 7,
                world_map_x: 0,
                world_map_y: 0,
            },
        },
        {
            // 昇り階段
            ascending: {
                x: 12,
                y: 11,
                world_map_x: 9,
                world_map_y: 5,
            },
            // 下り階段
            descending: {
                x: 8,
                y: 13,
                world_map_x: 5,
                world_map_y: 10,
            },
        },
    ];
}