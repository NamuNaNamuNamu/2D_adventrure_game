/* 敵キャラ全てが継承する大元クラス */

export class Enemy{
    constructor(x, y, world_map_x, world_map_y, img, hp, attack){
        this.x = x;                         // x 座標(タイル基準 = 一番左が 0, 一番右が 16), プレイヤーの画像の中心の座標とする
        this.y = y;                         // y 座標(タイル基準 = 一番上が 0, 一番下が 16), プレイヤーの画像の中心の座標とする
        this.world_map_x = world_map_x;     // その敵キャラが生息する ワールドマップの x 座標
        this.world_map_y = world_map_y;     // その敵キャラが生息する ワールドマップの y 座標
        this.img = img;                     // 写真
        this.direction = 0;                 // 身体の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.animation_frame = 0;           // 写真のアニメーション (0 と 1 と 2 と 3 を 交互に変えてアニメーションを実現する)
        this.in_action_frame = {
            move: 0,                        // 移動フレーム数。一回動いたら、このフレーム分は移動操作出来ない (前の動作の継続)
        };
        this.is_taking_a_break = false;     // 行動しない状態
        this.hp = hp;                       // HP
        this.attack = attack;               // 攻撃力 // NOTE: 難易度によってここを変動させるかも？
    }
}