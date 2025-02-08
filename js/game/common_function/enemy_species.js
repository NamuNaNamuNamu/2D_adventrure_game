/* 敵の種類一覧 */

export function enemy_species(){
    return {
        slime: {
            id: 1,
            name: "スライム",
            hp: 1,
            attack: 10,
        },
        grim_reaper: {
            id: 2,
            name: "しにがみ",
            hp: 5,
            attack: 30,
        },
        bat: {
            id: 3,
            name: "こうもり",
            hp: 1,
            attack: 15,
        },
        block_monster: {
            id: 4,
            name: "ブロックモンスター",
            hp: 8,
            attack: 20,            
        },
        black_dragon: {
            id: 90,
            name: "ブラックドラゴン",
            hp: 40,
            attack: 70,
        }
    }
}