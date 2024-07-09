// HPバーの描画

export function draw_hp_bar(canvas, context, _tile_size_in_canvas){
    const HP_BAR_WIDTH_COEFFICIENT = 0.25;              // HPバーの幅に係る係数
    const HP_BAR_HEIGHT_COEFFICIENT = 0.015;            // HPバーの高さに係る係数
    const HP_BAR_OUTSIDE_WIDTH_COEFFICIENT = 1;         // HPバーの外側の白い部分の横のサイズ比
    const HP_BAR_OUTSIDE_HEIGHT_COEFFICIENT = 1;        // HPバーの外側の白い部分の縦のサイズ比
    const HP_BAR_INSIDE_WIDTH_COEFFICIENT = 0.96;       // HPバーの内側の赤い部分の横のサイズ比
    const HP_BAR_INSIDE_HEIGHT_COEFFICIENT = 0.4;       // HPバーの内側の赤い部分の縦のサイズ比

    const HP_BAR_X = 0.14;  // canvas の横幅を 1 としたときの HPバーの横の中心 x座標
    const HP_BAR_Y = 0.02;  // canvas の縦幅を 1 としたときの HPバーの横の中心 y座標
    const OUTSIDE_WIDTH = canvas.width * HP_BAR_WIDTH_COEFFICIENT * HP_BAR_OUTSIDE_WIDTH_COEFFICIENT;       // HPバーの外側横幅
    const OUTSIDE_HEIGHT = canvas.height * HP_BAR_HEIGHT_COEFFICIENT * HP_BAR_OUTSIDE_HEIGHT_COEFFICIENT;   // HPバーの外側縦幅
    const INSIDE_WIDTH = canvas.width * HP_BAR_WIDTH_COEFFICIENT * HP_BAR_INSIDE_WIDTH_COEFFICIENT;         // HPバーの内側の横幅
    const INSIDE_HEIGHT = canvas.height * HP_BAR_HEIGHT_COEFFICIENT * HP_BAR_INSIDE_HEIGHT_COEFFICIENT;     // HPバーの内側の縦幅

    // 外側の白い部分
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(
        canvas.width * HP_BAR_X - OUTSIDE_WIDTH * 0.5,
        canvas.height * HP_BAR_Y - OUTSIDE_HEIGHT * 0.5,
        OUTSIDE_WIDTH,
        OUTSIDE_HEIGHT,
    );

    // HPバーの内側の赤色の部分
    context.fillStyle = "rgb(215, 0, 0)";
    context.fillRect(
        canvas.width * HP_BAR_X - INSIDE_WIDTH * 0.5,
        canvas.height * HP_BAR_Y - INSIDE_HEIGHT * 0.5,
        INSIDE_WIDTH,
        INSIDE_HEIGHT,
    );

    // HPバーの内側の緑色の部分
    context.fillStyle = "rgb(0, 185, 0)";
    context.fillRect(
        canvas.width * HP_BAR_X - INSIDE_WIDTH * 0.5,
        canvas.height * HP_BAR_Y - INSIDE_HEIGHT * 0.5,
        INSIDE_WIDTH * (this.status.hp / this.max_hp),
        INSIDE_HEIGHT,
    );
}
