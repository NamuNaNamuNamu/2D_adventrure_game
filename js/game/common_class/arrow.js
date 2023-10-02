/* 主人公の武器である弓矢クラス */
const ARROW_SPEED_COEFFICIENT = 0.75;    // 弓矢のスピードの係数

export class Arrow{
    constructor(x, y, direction, img){
        this.x = x;                     // x 座標(タイル基準 = 一番左が 0, 一番右が 16), 矢の画像の中心の座標とする
        this.y = y;                     // y 座標(タイル基準 = 一番上が 0, 一番下が 16), 矢の画像の中心の座標とする
        this.direction = direction;     // 矢の向き(0: 背面, 1: 正面, 2: 左, 3: 右)
        this.img = img;                 // 写真 (up: 上, down: 下, left: 左, right: 右)
    }

    // 弓矢の移動処理
    move(arrows){
        if(this.direction == 0) this.y = Math.round((this.y - MINIMUM_STEP * ARROW_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 1) this.y = Math.round((this.y + MINIMUM_STEP * ARROW_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 2) this.x = Math.round((this.x - MINIMUM_STEP * ARROW_SPEED_COEFFICIENT) * 100) / 100;
        if(this.direction == 3) this.x = Math.round((this.x + MINIMUM_STEP * ARROW_SPEED_COEFFICIENT) * 100) / 100;
        // もし、場外に出たら、弓矢を削除
        if(this.x < -0.5 || 
        this.x > FIELD_SIZE_IN_SCREEN + 0.5 || 
        this.y < -0.5 || 
        this.y > FIELD_SIZE_IN_SCREEN + 0.5){
            arrows.splice(arrows.indexOf(this), 1);
        }
    }

    // 弓矢の描画処理
    draw(canvas, context, tile_size_in_canvas){
        let arrow_img;
        if(this.direction == 0) arrow_img = this.img.up;
        if(this.direction == 1) arrow_img = this.img.down;
        if(this.direction == 2) arrow_img = this.img.left;
        if(this.direction == 3) arrow_img = this.img.right;

        context.drawImage(
            arrow_img, // img
            this.x * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dx (canvas の描画開始位置 x)
            this.y * tile_size_in_canvas - tile_size_in_canvas * 0.5,  // dy (canvas の描画開始位置 y)
            tile_size_in_canvas,  // d_width (canvas の描画サイズ 横幅)
            tile_size_in_canvas,  // d_height (canvas の描画サイズ 縦幅)
        );
    }
}