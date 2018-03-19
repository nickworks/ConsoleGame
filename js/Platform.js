function Platform(rect){
    this.rect=rect;
    
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        const r=this.rect;
        gfx.fillStyle="#00F";
        gfx.fillRect(r.x,r.y,r.w,r.h);  
    };
}