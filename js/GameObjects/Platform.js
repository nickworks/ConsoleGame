function Platform(raw={}){
    var id=raw.id||0;
    this.rect=Rect.from(raw);
    this.pattern=sprites.tiles;
    this.onlyGround=false;
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
    this.block=function(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping
            const fix=this.rect.findFix(rect);
            //console.log(fix);
            (o.pawn
                ?o.pawn.applyFix(fix)
                :o.applyFix(fix));
            
        });
    };
}