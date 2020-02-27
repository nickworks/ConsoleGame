class Menu {
    constructor(x,y,w,h,buttons=[]){
        this.buttons = []; 
        this.index = 0;
        let ty=y;
        buttons.forEach((b)=>{
            this.buttons.push(new Button(b.caption,b.callback,x,ty,w,h,"left"));
            ty+=h;
        });
    }
    update(){
        
        const b = this.buttons;
        
        if(keyboard.onDown(key.up)) this.index--;
        if(keyboard.onDown(key.down)) this.index++;
        
        if(this.index < 0) this.index = 0;
        if(this.index >= b.length) this.index = b.length-1;
        
        for(var i in b)b[i].update((i==this.index));
    }
    draw(){
        this.buttons.forEach( b => b.draw() );
    }
}