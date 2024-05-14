export class ExpandedArray extends Array {
    delete(element){
        /* 
        指定した配列の要素を消去する
        指定された要素が無ければ何もしない
        */
        if(this.includes(element)){
            this.splice(this.indexOf(element), 1);
        }
        else{
            throw new Error("array doesn't include the element");
        }
    }

    delete_all(){
        /*
        配列の要素を全削除する
        */
        this.splice(0);
    }
}