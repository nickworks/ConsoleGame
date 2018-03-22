function Platform(rect){
    this.rect=rect;
    
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle="#00F";
        this.rect.draw(gfx);
    };
}