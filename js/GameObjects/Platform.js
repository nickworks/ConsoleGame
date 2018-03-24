function Platform(raw){
    this.rect=Rect.from(raw);
    this.serialize=function(){
        return{
            x:this.rect.x,
            y:this.rect.y,
            w:this.rect.w,
            h:this.rect.h
        };
    };
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle="#00F";
        this.rect.draw(gfx);
    };
}