function NPC(){
    this.rect=new Rect(100, 100, 25, 25);
    
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        const r=this.rect;
        gfx.fillRect(r.x,r.y,r.w,r.h);
    };
}