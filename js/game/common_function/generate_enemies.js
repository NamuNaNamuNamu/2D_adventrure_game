/* 敵を生成する */

import { enemy_species } from "./enemy_species.js";
import { world_map } from "./world_map.js";

import { Slime } from "../common_class/enemies/slime.js";
import { GrimReaper } from "../common_class/enemies/grim_reaper.js";

export function generate_enemies(world_map_x, world_map_y, img, enemies){
    // プレイヤーが移動した先のマップに生息している敵キャラを追加
    for(let enemy of world_map()[world_map_x][world_map_y].enemies){
        if(enemy.species_id == enemy_species().slime.id){
            let slime_img = {
                original: img.slime,
                damaged: img.slime_damaged,
            }
            enemies.push(new Slime(enemy.x, enemy.y, world_map_x, world_map_y, slime_img, enemy_species().slime.hp, enemy_species().slime.attack));
        }

        if(enemy.species_id == enemy_species().grim_reaper.id){
            let grim_reaper_img = {
                original: img.grim_reaper,
                damaged: img.grim_reaper_damaged,
                magic_bullet: img.magic_bullet,
            }
            enemies.push(new GrimReaper(enemy.x, enemy.y, world_map_x, world_map_y, grim_reaper_img, enemy_species().grim_reaper.hp, enemy_species().grim_reaper.attack))
        }
    }
}