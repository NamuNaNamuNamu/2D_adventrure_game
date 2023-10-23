## ファイル構造

- img <!-- 画像一覧 -->
- js <!-- js ファイル -->
    - game <!-- ゲーム内容に関わる処理 -->
        - common_class <!-- ゲーム内容における処理全般で使えるクラス -->
            - enemies <!-- 敵キャラクラス -->
            * enemy.js <!-- 敵キャラ大元クラス -->
            * arrow.js <!-- プレイヤーの武器である弓矢 Arrow クラス -->
            * player.js <!-- プレイヤー Player クラス -->
        - common_function <!-- ゲーム内容における処理全般で使える関数 -->
            - world_map_parts <!-- マップのパーツ(16 × 16 サイズ = 1画面分) -->
            * change_screen_to.js <!-- メインループを止めて、次の画面に遷移する関数 -->
            * draw_map.js <!-- マップのパーツのデータに従って、キャンパスに描画する関数 -->
            * world_map.js <!-- マップのパーツを組み合わせて、世界全体(ワールドマップ)を定義 -->
            * generate_enemies.js <!-- 敵キャラを実際に生成する -->
            * delete_all.js <!-- 配列の要素を全削除する -->
            * delete_one.js<!-- 特定の要素 (引数の element) を配列から削除 -->
            * enemy_species.js <!-- 敵の種類一覧 -->
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