function Platform(rect){
    this.rect=rect;
    
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle="#00F";
        this.rect.draw(gfx);
    };
    this.fixOverlaps=function(o){
        if(!Array.isArray(o))o=[o];
        o.forEach(i=>{
            if(i.pawn) i.pawn.fixOverlap(this.rect);
            else if(i.fixOverlap) i.fixOverlap(this.rect);
        });
    };
}