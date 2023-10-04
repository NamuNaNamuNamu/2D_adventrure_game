/* 定数一覧 */
// プログラム全体で用いる定数はここに一覧で記載する

// canvas の 画面サイズに対する比率 (1 にすると、縦いっぱい、または横いっぱいになる)
CANVAS_SIZE_RATIO = 0.9;

// FPS (frame per second) ... 1 秒間に何回画面を更新するか
FPS = 30;

// 1 画面に収まる タイル の数
const FIELD_SIZE_IN_SCREEN = 16;

// キャラクターの最小移動単位 (タイル換算)
MINIMUM_STEP = 0.5;

//// プレイヤー関連

// プレイヤーの初期リスポーン位置 (ワールドマップの x, y 座標換算)
INITIAL_WORLD_MAP_X = 1;
INITIAL_WORLD_MAP_Y = 0;