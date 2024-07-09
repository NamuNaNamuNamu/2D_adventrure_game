/* 1つのマップを描画する関数 */

export function draw_map(map_data, canvas, context, map_chip_img){
    /*
    定義したマップデータ(16 × 16 の 2次元配列)に従って、描画する
    */

    const TOP_LEFT_CORNER_AXIS = {          // マップチップ本体の左上端
        x: 8,
        y: 24,
    };
    const TILE = {
        width: 32,  // マップチップ画像上でのマップチップ 1つ分の幅
        height: 32, // マップチップ画像上でのマップチップ 1つ分の幅
    };
    const TILE_SIZE_IN_CANVAS = canvas.width / FIELD_SIZE_IN_SCREEN; // 1 タイルの canvas 上でのサイズ

    for(let row = 0; row < FIELD_SIZE_IN_SCREEN; row++){
        for(let column = 0; column < FIELD_SIZE_IN_SCREEN; column++){
            const NUM_OF_IMAGE = 16; // 1つのマップチップの png ファイルに含まれるマップチップの数
            let img;
            if(map_data[row][column] >= NUM_OF_IMAGE * 2) img = map_chip_img.map_chip3;
            else if(map_data[row][column] >= NUM_OF_IMAGE) img = map_chip_img.map_chip2;
            else img = map_chip_img.map_chip1;

            context.drawImage(
                img, // img
                TOP_LEFT_CORNER_AXIS.x + map_data[row][column] % 4 * TILE.width,  // sx (元画像の切り抜き始点 x)
                TOP_LEFT_CORNER_AXIS.y + Math.floor(map_data[row][column] % 16 / 4) * TILE.height,  // sy (元画像の切り抜き始点 y)
                TILE.width,  // s_width (元画像の切り抜きサイズ 横幅)
                TILE.height,  // s_height (元画像の切り抜きサイズ 縦幅)
                column * TILE_SIZE_IN_CANVAS,  // dx (canvas の描画開始位置 x)
                row * TILE_SIZE_IN_CANVAS,  // dy (canvas の描画開始位置 y)
                TILE_SIZE_IN_CANVAS,  // d_width (canvas の描画サイズ 横幅)
                TILE_SIZE_IN_CANVAS,  // d_height (canvas の描画サイズ 縦幅)
            );
        }
    }
}