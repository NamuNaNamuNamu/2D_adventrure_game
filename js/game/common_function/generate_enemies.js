/* 敵を生成する */

import { enemy_species } from "./enemy_species.js";
import { world_map } from "./world_map.js";

import { Slime } from "../common_class/enemies/slime.js";

export function generate_enemies(world_map_x, world_map_y, img, enemies){
    // プレイヤーが移動した先のマップに生息している敵キャラを追加
    for(let enemy of world_map()[world_map_x][world_map_y].enemies){
        if(enemy.species_id == enemy_species().slime.id) enemies.push(new Slime(enemy.x, enemy.y, world_map_x, world_map_y, img.blue_slime, enemy_species().slime.hp, enemy_species().slime.attack));
    }
}