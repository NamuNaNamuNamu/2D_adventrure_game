## ファイル構造

- img <!-- 画像一覧 -->
- js <!-- js ファイル -->
    - game <!-- ゲーム内容に関わる処理 -->
        - common_class <!-- ゲーム内容における処理全般で使えるクラス -->
            - enemies <!-- 敵キャラクラス -->
            - enemy_weapon <!-- 敵の武器クラス -->
                * magic_bullet.js <!-- 魔法弾クラス -->
                * fire.js <!-- 炎攻撃クラス -->
            * enemy.js <!-- 敵キャラ大元クラス -->
            * arrow.js <!-- プレイヤーの武器である弓矢 Arrow クラス -->
            * expanded_array.js <!-- 機能拡張した Array (組み込み) クラス -->
            * player.js <!-- プレイヤー Player クラス -->
        - common_function <!-- ゲーム内容における処理全般で使える関数 -->
            - world_map_parts <!-- マップのパーツ(16 × 16 サイズ = 1画面分) -->
            * calculate_target_direction.js <!-- 目標の方向を算出する -->
            * change_map_by_stairs_list <!-- 階段によるマップ移動を定義した関数 -->
            * change_map_from_map_x0_y1_to_map_x0_y0.js <!-- マップ[0][1]からラスボスの城のあるマップ[0][0]に行くときの謎解き要素の追加 -->
            * change_screen_to.js <!-- メインループを止めて、次の画面に遷移する関数 -->
            * draw_map.js <!-- マップのパーツのデータに従って、キャンパスに描画する関数 -->
            * world_map.js <!-- マップのパーツを組み合わせて、世界全体(ワールドマップ)を定義 -->
            * generate_enemies.js <!-- 敵キャラを実際に生成する -->
            * last.js <!-- 配列の一番最後の要素を参照する -->
            * enemy_species.js <!-- 敵の種類一覧 -->
        - screens <!-- ゲーム画面 -->
            * start.js <!-- スタート画面 -->
            * setting.js <!-- 設定画面 -->
            * game.js <!-- プレイ画面 -->
    - global_class <!-- プログラム全体で用いるクラス -->
        * key.js <!-- 入力情報をつかさどる Key クラス -->
    - global_function <!-- プログラム全体で用いる関数 -->
        * canvas_initialize.js <!-- canvas をまっさらに初期化する関数 -->
    * constants.js <!-- プログラム全体で用いる定数はここに一覧で記載する -->
    * main.js <!-- 一番最初に呼ばれる関数 -->
    * call_main.js <!-- main 関数を呼ぶための関数(html と main 関数の仲介役) -->
* index.html <!-- 初期ページ -->
* readme.md <!-- このファイル -->