class Button {
    constructor(caption,callback,x,y,w,h,align="left",worldSpace=false){
        this.padding=25;
        this.text=new TextField(caption,0,0,{align:align,valign:"middle"});
        this.callback=callback;
        this.rect=new Rect(x,y,w,h);
        this.colorNormal="rgba(128,128,128,.75)";
        this.colorHover="#9AF";
        this.hover=false;
        this.selected=false;
        this.align=align;
        this.mouse = {x:0,y:0};
        this.worldSpace = !!worldSpace;
    }
    update(selected=false, offset){

        if(!offset) offset = {x:0, y:0};

        if(this.worldSpace){
            this.mouse = game.scene.cam.worldMouse(); // this messes up the pause menu...
        } else {
            this.mouse = mouse.pos();
        }
        this.mouse.x -= offset.x;
        this.mouse.y -= offset.y;
        

        this.hover=this.rect.hits(this.mouse);
        this.selected=!!selected;
        if(this.hover && mouse.onDown()) this.callback();
        if(this.selected && keyboard.onDown(key.menuChoose())) this.callback();
    }
    draw(offset){

        Matrix.push();
        Matrix.translate(this.rect.x, this.rect.y);
        const hover=this.hover||this.selected;
        gfx.fillStyle=hover?this.colorHover:this.colorNormal;
        gfx.fillRect(0,0,this.rect.w,this.rect.h);
        
        var x=this.rect.w/2;
        if(this.align=="left")x=this.padding;
        if(this.align=="right")x=this.rect.w-this.padding;
        
        this.text.x=x;
        this.text.y=this.rect.h/2;
        this.text.draw();
        Matrix.pop();
    }
}