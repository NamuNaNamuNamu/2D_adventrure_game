## ファイル構造

- img <!-- 画像一覧 -->
- js <!-- js ファイル -->
    - game <!-- ゲーム内容に関わる処理 -->
        - common_function <!-- ゲーム内容における処理全般で使える関数 -->
            * change_screen_to.js <!-- メインループを止めて、次の画面に遷移する関数 -->
        * start.js <!-- スタート画面 -->
        * setting.js <!-- 設定画面 -->
    - global_class <!-- プログラム全体で用いるクラス -->
        * key.js <!-- 入力情報をつかさどる Key クラス -->
    - global_function <!-- プログラム全体で用いる関数 -->
        * canvas_initialize.js <!-- canvas をまっさらに初期化する関数 -->
    * constants.js <!-- プログラム全体で用いる定数はここに一覧で記載する -->
    * main.js <!-- 一番最初に呼ばれる関数 -->
    * call_main.js <!-- main 関数を呼ぶための関数(html と main 関数の仲介役) -->
* index.html <!-- 初期ページ -->