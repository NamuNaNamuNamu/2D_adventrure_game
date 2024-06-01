/* クラスにメソッドを mixin する */
 
// 使い方:
// クラス定義のあとに以下のように使う
// include(<mixin 先クラス>, <mixin したいメソッド>)
export function include(class_, method){ // NOTE: class は予約語なので、最後に _ を付けて回避。
    Object.assign(class_.prototype, {[method.name]: method});
}