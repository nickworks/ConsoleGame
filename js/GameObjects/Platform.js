function Platform(raw={}){
    var id=raw.id||0;
    this.rect=Rect.from(raw);
    this.pattern=sprites.tiles;
    this.serialize=function(){
        return{
            i:id,
            x:this.rect.x,
            y:this.rect.y,
            w:this.rect.w,
            h:this.rect.h
        };
    };
    this.id=function(i){
        if(i)id=i;
        return id;  
    };
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle=this.pattern;
        this.rect.draw(gfx);
    };
}