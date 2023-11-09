/* 敵を生成する */

import { enemy_species } from "./enemy_species.js";
import { world_map } from "./world_map.js";

import { Slime } from "../common_class/enemies/slime.js";
import { GrimReaper } from "../common_class/enemies/grim_reaper.js";
import { BlackDragon } from "../common_class/enemies/black_dragon.js";

export function generate_enemies(world_map_x, world_map_y, img, enemies){
    // プレイヤーが移動した先のマップに生息している敵キャラを追加
    for(let enemy of world_map()[world_map_x][world_map_y].enemies){
        // スライム
        if(enemy.species_id == enemy_species().slime.id){
            let slime_img = {
                original: img.slime,
                damaged: img.slime_damaged,
            };
            let status = {
                hp: enemy_species().slime.hp,
                atk: enemy_species().slime.attack,
            };
            enemies.push(new Slime(enemy.x, enemy.y, world_map_x, world_map_y, slime_img, status));
        }

        // しにがみ
        if(enemy.species_id == enemy_species().grim_reaper.id){
            let grim_reaper_img = {
                original: img.grim_reaper,
                damaged: img.grim_reaper_damaged,
                magic_bullet: img.magic_bullet,
            };
            let status = {
                hp: enemy_species().grim_reaper.hp,
                atk: enemy_species().grim_reaper.attack,
            };
            enemies.push(new GrimReaper(enemy.x, enemy.y, world_map_x, world_map_y, grim_reaper_img, status));
        }

        // ブラックドラゴン
        if(enemy.species_id == enemy_species().black_dragon.id){
            let black_dragon_img = {
                original: [img.black_dragon1, img.black_dragon2],
                damaged: [img.black_dragon_damaged1, img.black_dragon_damaged2],
                fire: [img.fire1, img.fire2],
            };
            let status = {
                hp: enemy_species().black_dragon.hp,
                atk: enemy_species().black_dragon.attack,
            };
            enemies.push(new BlackDragon(enemy.x, enemy.y, world_map_x, world_map_y, black_dragon_img, status));
        }
    }
}