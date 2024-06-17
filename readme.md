## ファイル構造

- img        <!-- 画像一覧 -->
- js         <!-- js ファイル -->
    - game            <!-- ゲーム内容に関わる処理 -->
        - common_class    <!-- ゲーム内容における処理全般で使えるクラス -->
            - enemies           <!-- 敵キャラ -->
                - <enemy_name> <!-- 例) slime, grim_reaper -->
                    - methods         <!-- その敵キャラ内で使われているメソッド -->
                        - 01_control <!-- <enemy_name> クラスの control メソッド内で使われているメソッド -->
                        - 02_action  <!-- <enemy_name> クラスの action メソッド内で使われているメソッド -->
                        - 03_draw    <!-- <enemy_name> クラスの draw メソッド内で使われているメソッド -->
                    - weapon          <!-- その敵キャラが使う武器 -->
                    * <enemy_name>.js <!-- 敵キャラクラス -->
            - player            <!-- プレイヤーキャラ -->
                - methods   <!-- プレイヤーキャラ内で使われているメソッド -->
                    - 01_control    <!-- プレイヤークラスの control メソッド内で使われているメソッド -->
                    - 02_action     <!-- プレイヤークラスの action メソッド内で使われているメソッド -->
                    - 03_draw       <!-- プレイヤークラスの draw メソッド内で使われているメソッド -->
                    * is_damaged.js <!-- プレイヤーキャラがダメージを受ける処理 -->
                - weapon    <!-- プレイヤーキャラが使う武器 -->
                    * arrow.js <!-- プレイヤーの武器である弓矢クラス -->
                * player.js <!-- プレイヤークラス -->
            - z0_common_methods <!-- 敵キャラ、プレイヤーキャラ共通で使うメソッド -->
                - 01_control             <!-- control メソッド内で使われるメソッド -->
                - 02_action              <!-- action メソッド内で使われるメソッド -->
                - 03_draw                <!-- draw メソッド内で使われるメソッド -->
                * check_movability.js    <!-- 現在地から進もうとしている方向に進めるかどうか確かめる -->
                * is_overlapping_with.js <!-- 重なっているかどうかを確かめる -->
            * enemy.js          <!-- 敵キャラ大元クラス --> <!-- TODO: それぞれメソッド毎に分けて、それを import するようにする。これは削除する。 -->
        - common_function <!-- ゲーム内容における処理全般で使える関数 -->
            - world_map_parts                           <!-- マップのパーツ(16 × 16 サイズ = 1画面分) -->
            * calculate_target_direction.js             <!-- 目標の方向を算出する -->
            * change_map_by_stairs_list                 <!-- 階段によるマップ移動を定義した関数 -->
            * change_map_from_map_x0_y1_to_map_x0_y0.js <!-- マップ[0][1] からラスボスの城のある マップ[0][0] に行くときの謎解き要素の追加 -->
            * change_screen_to.js                       <!-- メインループを止めて、次の画面に遷移する関数 -->
            * draw_map.js                               <!-- マップのパーツのデータに従って、キャンパスに描画する関数 -->
            * enemy_species.js                          <!-- 敵の種類一覧 -->
            * generate_enemies.js                       <!-- 敵キャラを実際に生成する -->
            * world_map.js                              <!-- マップのパーツを組み合わせて、世界全体(ワールドマップ)を定義 -->
        - screens         <!-- ゲーム画面 -->
            * 01_start.js   <!-- スタート画面 -->
            * 02_setting.js <!-- 設定画面 -->
            * 03_game.js    <!-- プレイ画面 -->
    - global_class    <!-- プログラム全体で用いるクラス -->
        * expanded_array.js <!-- 組み込みの Array クラスを機能拡張したもの -->
        * key.js            <!-- 入力情報をつかさどる Key クラス -->
    - global_function <!-- プログラム全体で用いる関数 -->
        * canvas_initialize.js <!-- canvas をまっさらに初期化する関数 -->
        * get_random_int.js    <!-- min 以上 max 以下のランダムな整数を返す -->
        * include.js           <!-- クラスにメソッドを mixin するためのメソッド -->
    * call_main.js    <!-- main 関数を呼ぶための関数 (html と main 関数の仲介役) -->
    * constants.js    <!-- プログラム全体で用いる定数はここに一覧で記載する -->
    * main.js         <!-- 一番最初に呼ばれる関数 -->
* index.html <!-- 初期ページ -->
* readme.md  <!-- このファイル -->