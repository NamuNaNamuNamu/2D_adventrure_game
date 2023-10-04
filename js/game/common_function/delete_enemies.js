/* 敵を削除する */

// 全削除
export function delete_enemies(enemies){
    enemies.splice(0);
}

// 特定の敵キャラ (引数の enemy) を削除
export function delete_enemy(enemies, enemy){
    if(enemies.includes(enemy)){
        enemies.splice(enemies.indexOf(enemy), 1);
    }
}