/* 特定の要素 (引数の element) を配列から削除 */

export function delete_one(array, element){
    if(array.includes(element)){
        array.splice(array.indexOf(element), 1);
    }
}