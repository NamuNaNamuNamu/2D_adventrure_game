// 小型モンスターを描画する。 ex) スライム、しにがみ

const COLOR = {
    original: 0,    // 通常時の色 
    damaged: 1,     // 被ダメージ時の色
}

export function draw_small_enemy(_canvas, context, tile_size_in_canvas){
    const TOP_LEFT_CORNER_AXIS = {          // マップチップ本体の左上端
        x: 0,
        y: 0,
    };
    const TILE = {
        width: 32,  // マップチップ画像上でのマップチップ 1つ分の幅
        height: 32, // マップチップ画像上でのマップチップ 1つ分の幅
    };
    const DIRECTION_ORDER = [3, 0, 1, 2]; // 向きと写真の順番を合わせるための配列
    const MARGIN_LEFT = 6;
    const MARGIN_RIGHT = 6;
    const MARGIN_TOP = 12;
    const MARGIN_BOTTOM = 0;

    let enemy_img;
    // 色を画像に反映
    if(this.color == COLOR.original) enemy_img = this.img.original;
    else if(this.color == COLOR.damaged) enemy_img = this.img.damaged;

    context.drawImage(
        enemy_img, // img
        TOP_LEFT_CORNER_AXIS.x + MARGIN_LEFT + this.animation_order[this.animation_frame] * TILE.width,  // sx (元画像の切り抜き始点 x)
        TOP_LEFT_CORNER_AXIS.y + MARGIN_TOP + DIRECTION_ORDER[this.direction] * TILE.height,  // sy (元画像の切り抜き始点 y)
        TILE.width - (MARGIN_LEFT + MARGIN_RIGHT),  // s_width (元画像の切り抜きサイズ 横幅)
        TILE.height - (MARGIN_TOP + MARGIN_BOTTOM),  // s_height (元画像の切り抜きサイズ 縦幅)
        this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
        this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
        tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
        tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
    );
}