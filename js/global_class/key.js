/* 入力情報をつかさどる Key クラス */

export class Key{
    constructor(){
        // WASD キー
        this.is_w_pressed = false;
        this.is_a_pressed = false;
        this.is_s_pressed = false;
        this.is_d_pressed = false;
        // Space キー
        this.is_space_pressed = false;
        // Enter キー
        this.is_enter_pressed = false;
        // Shift キー
        this.is_shift_pressed = false;
    }

    // キーが押されたとき
    pressed(k){
        if(k == "w") this.is_w_pressed = true;
        if(k == "a") this.is_a_pressed = true;
        if(k == "s") this.is_s_pressed = true;
        if(k == "d") this.is_d_pressed = true;
        if(k == " ") this.is_space_pressed = true;
        if(k == "Enter") this.is_enter_pressed = true; 
        if(k == "Shift") this.is_shift_pressed = true;
    }

    // キーが離されたとき
    released(k){
        if(k == "w") this.is_w_pressed = false;
        if(k == "a") this.is_a_pressed = false;
        if(k == "s") this.is_s_pressed = false;
        if(k == "d") this.is_d_pressed = false;
        if(k == " ") this.is_space_pressed = false;
        if(k == "Enter") this.is_enter_pressed = false;
        if(k == "Shift") this.is_shift_pressed = false;
    }
}