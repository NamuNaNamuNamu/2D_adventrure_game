/* キャンバスの初期化 (画面をまっさらに) */

export function canvas_initialize(canvas, context){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(200, 200, 220)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}