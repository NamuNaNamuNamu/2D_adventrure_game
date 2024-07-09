// 炎の攻撃判定

import { calculate_target_direction } from "./../../../../../common_function/calculate_target_direction.js";
import { Fire } from "./../../weapon/fire.js";
import { COOL_TIME } from "../../black_dragon.js";

const FIRE_ATK_COEFFICIENT = 0.5;       // 直接、身体が触れる攻撃を 1 としたときの、炎の攻撃倍率。atk に 掛け算する。

export function attack_by_fire(player, tile_size_in_canvas){
    // 炎の攻撃判定
    for(let fire of this.fires){
        fire.attack(player, this.status.atk * FIRE_ATK_COEFFICIENT, tile_size_in_canvas);
    }

    if(this.in_action_frame.attack <= 0){
        this.in_action_frame.attack = COOL_TIME.attack;
    }

    if(this.in_action_frame.attack == COOL_TIME.attack){
        let adjustment = { // 口から炎を吐き出すための位置の調整値 (タイル単位)
            x: -0.3,
            y: -0.4,
        }
        let [vx, vy] = calculate_target_direction(this.x + adjustment.x, this.y + adjustment.y, player.x, player.y);
        let fire = new Fire(this.x + adjustment.x, this.y + adjustment.y, vx, vy, this.img.fire);
        this.fires.push(fire);
    }

    // 攻撃フレームを 1 進める
    this.in_action_frame.attack--;
}