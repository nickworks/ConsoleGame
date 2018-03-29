function Menu(x,y,w,h,buttons=[]){
    this.buttons = [];
    this.index = 0;
    let ty=y;
    buttons.forEach((b)=>{
        this.buttons.push(new Button(b.caption,b.callback,x,ty,w,h,"left"));
        ty+=h;
    });
    this.update=function(dt){
        
        const b = this.buttons;
        
        if(keyboard.onDown(keycode.up)) this.index--;
        if(keyboard.onDown(keycode.down)) this.index++;
        
        if(this.index < 0) this.index = 0;
        if(this.index >= b.length) this.index = b.length-1;
        
        for(var i in b)b[i].update(dt,(i==this.index));
    };
    this.draw=function(gfx){
        this.buttons.forEach((b)=>{
            b.draw(gfx);
        });
    };
}