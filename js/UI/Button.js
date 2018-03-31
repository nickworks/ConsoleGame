function Button(caption,callback,x,y,w,h,align="left"){
    this.padding=25;
    this.text=new TextField(caption,0,0,{align:align,valign:"middle"});
    this.callback=callback;
    this.rect=new Rect(x,y,w,h);
    this.colorNormal="rgba(128,128,128,.75)";
    this.colorHover="#9AF";
    this.hover=false;
    this.selected=false;
    this.update=function(dt, selected){
        this.hover=this.rect.hits(mouse.pos());
        this.selected=selected;
        if(this.hover && mouse.onDown()) this.callback();
        if(this.selected && keyboard.onDown(key.menuChoose())) this.callback();
    };
    this.draw=function(gfx){
        gfx.beginTransform();
        gfx.translate(this.rect.x, this.rect.y);
        const hover=this.hover||this.selected;
        gfx.fillStyle=hover?this.colorHover:this.colorNormal;
        gfx.fillRect(0,0,this.rect.w,this.rect.h);
        
        var x=this.rect.w/2;
        if(align=="left")x=this.padding;
        if(align=="right")x=this.rect.w-this.padding;
        
        this.text.x=x;
        this.text.y=this.rect.h/2;
        this.text.draw(gfx);
        gfx.endTransform();
    };
}