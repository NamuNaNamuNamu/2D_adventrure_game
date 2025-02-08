// 岩落とし攻撃
//
// 以下の 2 つによって岩落とし攻撃を実現する。
// 1. 既に放った岩の攻撃判定を発動する
// 2. 移動中でないときにプレイヤーキャラが視界に入った場合、岩を放つ (最大 1 秒に 1 回)

import { Rock } from "../../weapon/rock/rock.js";
import { COOL_TIME } from "../../block_monster.js";

const ROCK_ATK_COEFFICIENT = 1.5;   // 直接、身体が触れる攻撃を 1 としたときの、魔法弾の攻撃倍率。atk に 掛け算する。

export function attack_by_rock(player, tile_size_in_canvas, animation_order) {
    // 1. 既に放った岩の攻撃判定を発動する
    for(let rock of this.rocks){
        rock.attack(player, this.status.atk * ROCK_ATK_COEFFICIENT, tile_size_in_canvas);
    }

    // 2. 移動中でないときにプレイヤーキャラが視界に入った場合、岩を放つ (最大 1 秒に 1 回)
    if(this.in_action_frame.attack == COOL_TIME.attack) {
        // 岩を追加
        let rock = new Rock(player.x, player.y, {rock: this.img.rock, shadow: this.img.shadow});
        this.rocks.push(rock);
    }

    if(this.in_action_frame.attack > 0) {
        if (this.in_action_frame.attack % 4 == 0) {
            // アニメーションを動かす
            const NUM_OF_ANIMATION_FLAME = animation_order.length;      // アニメーションの数
            this.animation_frame = (this.animation_frame + 1) % NUM_OF_ANIMATION_FLAME; // アニメーションを 1 動かす
        }

        this.in_action_frame.attack--;
    }
}