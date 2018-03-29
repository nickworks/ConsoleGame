function Button(caption, callback, x, y, w, h){
    this.text=new TextField(caption, 0, 0, {align:"center",valign:"middle"});
    this.callback=callback;
    this.rect=new Rect(x,y,w,h);
    this.colorNormal="#CCC";
    this.colorHover="#EEE";
    this.hover=false;
    this.selected=false;
    this.update=function(dt, selected){
        this.hover=this.rect.hits(mouse.pos());
        this.selected=selected;
        if(this.hover && mouse.onDown()) this.callback();
        if(this.selected && keyboard.onDown(keycode.enter)) this.callback();
    };
    this.draw=function(gfx){
        gfx.translate(this.rect.x, this.rect.y);
        gfx.fillStyle=(this.hover||this.selected)?this.colorHover:this.colorNormal;
        gfx.fillRect(0,0,this.rect.w,this.rect.h);
        this.text.x=this.rect.w/2;
        this.text.y=this.rect.h/2;
        this.text.draw(gfx);
        gfx.resetTransform();
    };
}