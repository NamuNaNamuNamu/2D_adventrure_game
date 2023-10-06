/* しにがみクラス */

import { MagicBullet } from "../magic_bullet.js";
import { Enemy } from "./../enemy.js";

const WIDTH = 0.35;   // しにがみの当たり判定の横幅
const HEIGHT = 0.35;  // しにがみの当たり判定の縦幅
const MAGIC_BULLET_ATK_COEFFICIENT = 0.5;   // 直接、身体が触れる攻撃と比較した、魔法弾の攻撃倍率
const SPEED_COEFFICIENT = 0.166;            // しにがみのスピードの係数 (≒ 1 ÷ MOVE_COOL_TIME)
const MOVE_COOL_TIME = 6;                   // 移動クールタイム（1歩で 6フレーム費やす）
const ATTACK_COOL_TIME = 60;                // 攻撃クールタイム
const NUM_OF_MOVE_PATTERN = 7;              // 全行動パターン数
const ANIMATION_ORDER = [0, 1, 2, 1];       // アニメーションの流れ
const MAP_CHIP_WHICH_GRIM_REAPER_CANNOT_MOVE_ON = [ // しにがみが移動できない床
    2,  // 海
    4,  // 剣のマークの看板
    8,  // 木
    9,  // 岩
    10, // テーブル
    11, // 石レンガ
    15, // 石レンガ(壁)
];

export class GrimReaper extends Enemy{
    constructor(x, y, world_map_x, world_map_y, img, hp, atk){
        super(x, y, world_map_x, world_map_y, WIDTH, HEIGHT, img, MAP_CHIP_WHICH_GRIM_REAPER_CANNOT_MOVE_ON, SPEED_COEFFICIENT, ANIMATION_ORDER, hp, atk);
        this.magic_bullets = [];    // 放った魔法弾
    }

    // 行動を決定する
    // game.js の メインループから呼び出される
    // direction と、in_action_frame.move, is_taking_a_break を変更し、行動の準備をする。
    // 1. 0 ~ NUM_OF_MOVE_PATTERN のうち 1 パターンに行動が決まる
    //     1-1. パターンが 4 ~ NUM_OF_MOVE_PATTERN の場合、動かない
    //     1-2. パターンが 0 ~ 3 の場合、プレイヤーキャラに近づくように動く
    control(player){
        // 行動中であれば、受け付けない
        if(this.in_action_frame.move > 0) return;

        // クールタイムをリセット
        this.in_action_frame.move = MOVE_COOL_TIME;

        // 行動をランダムで決める
        let pattern = Math.floor(Math.random() * NUM_OF_MOVE_PATTERN);

        // 4 ~ NUM_OF_MOVE_PATTERN の場合 => 動かない
        if(pattern >= 4 && pattern <= NUM_OF_MOVE_PATTERN){
            this.is_taking_a_break = true;
        }
        // 0 ~ 3 の場合 => プレイヤーキャラに近づくように動く
        else{
            this.face_the_direction_of_the_player_character(player);
        }

        // 行動決めで「おやすみ」が決まった場合、
        // マップ外にでないようにする処理と、移動可能性チェックは必要ないので、メソッド終了
        if(this.is_taking_a_break) return;

        // マップの端に行ったら、マップ外に出ないように戻る
        // 戻ることを決めたなら、移動可能性チェックは必要ないので、メソッド終了
        if(this.stay_in_the_map()) return;

        // 決めた方向に移動可能かどうか確かめる => 不可能なら、動作命令は解除 (this.in_action_frame.move を 0 に)
        if(this.check_movability(this.direction) == false) this.in_action_frame.move = 0;
    }

    // 敵キャラの移動処理
    // action メソッドから呼び出される
    // 魔法弾を動かす
    move(){
        // 魔法弾を動かす
        for(let magic_bullet of this.magic_bullets){
            magic_bullet.move(this.magic_bullets);
        }
        // Enemy クラスの move メソッドを呼ぶ
        super.move()
    }

    // 攻撃判定
    // プレイヤーキャラと重なったら、ダメージを与える
    // action メソッドから呼び出される
    attack(player, tile_size_in_canvas){
        super.attack(player, tile_size_in_canvas);

        // 魔法弾の攻撃判定
        for(let magic_bullet of this.magic_bullets){
            magic_bullet.attack(player, this.atk * MAGIC_BULLET_ATK_COEFFICIENT, tile_size_in_canvas);
        }

        // 向いている方向にプレイヤーキャラが通ったら、その方向に弾を発射する
        // まず、プレイヤーキャラのいる位置 から 自分のいる位置を引く
        let x_diff = player.x - this.x;
        let y_diff = player.y - this.y;
        if(this.in_action_frame.attack <= 0){
            if(
                this.direction == 0 && y_diff < 0 && x_diff == 0 || // 上を向いているとき
                this.direction == 1 && y_diff > 0 && x_diff == 0 || // 下を向いているとき
                this.direction == 2 && x_diff < 0 && y_diff == 0 || // 左を向いているとき
                this.direction == 3 && x_diff > 0 && y_diff == 0    // 右を向いているとき
            ){
                this.in_action_frame.attack = ATTACK_COOL_TIME;
            }
        }

        // アクションが終了したら、動作は行わない
        if(this.in_action_frame.attack <= 0) return;

        if(this.in_action_frame.attack == ATTACK_COOL_TIME){
            let magic_bullet = new MagicBullet(this.x, this.y, this.direction, this.img.magic_bullet);
            this.magic_bullets.push(magic_bullet);
        }

        // 攻撃フレームを 1 進める
        this.in_action_frame.attack--;
    }

    // 描画処理
    // game.js の メインループから呼び出される
    draw(canvas, context, tile_size_in_canvas){
        // 魔法弾の描画
        for(let magic_bullet of this.magic_bullets){
            magic_bullet.draw(canvas, context, tile_size_in_canvas);
        }

        // Enemy クラスの draw メソッドを呼ぶ
        super.draw(canvas, context, tile_size_in_canvas);
    }

    // プレイヤーキャラのいる方向を向く
    // control メソッドから呼び出される
    face_the_direction_of_the_player_character(player){
        // まず、プレイヤーキャラのいる位置 から 自分のいる位置を引く
        let x_diff = player.x - this.x;
        let y_diff = player.y - this.y;

        // 全く同じ位置にいる場合は、動かなくていい
        if(x_diff == 0 && y_diff == 0){ 
            this.is_taking_a_break = true;
            return;
        }

        // x 方向 の方が距離の差がある場合 (x 方向 と y 方向 の距離の差が同じ場合も含む)
        if(Math.abs(x_diff) >= Math.abs(y_diff)){
            // プレイヤーキャラが自分から見て左にいるなら左を向く
            if(x_diff < 0) this.direction = 2;
            // プレイヤーキャラが自分から見て右にいるなら右を向く
            else this.direction = 3;
        }
        // y 方向 の方が距離の差がある場合
        else{
            // プレイヤーキャラが自分から見て上にいるなら上を向く
            if(y_diff < 0) this.direction = 0;
            // プレイヤーキャラが自分から見て下にいるなら下を向く
            else this.direction = 1;
        }
    }
}