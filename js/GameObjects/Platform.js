function Platform(raw={}){
    var id=raw.id||0;
    this.rect=Rect.from(raw);
    this.pattern=sprites.tiles;
    this.solid=(!raw.s);
    this.serialize=function(){
        const data={
            i:id,
            x:this.rect.x,
            y:this.rect.y,
            w:this.rect.w,
            h:this.rect.h,
        };
        if(!this.solid)data.s=1;
        return data;
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
    this.block=function(a, dt){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping
            const fix=this.rect.findFix(rect);
            if(!this.solid){
                fix.x=0;
                //when should we IGNORE vertical fixes?
                if(rect.vy<=0)return; //if the object is moving UP, this platform shouldn't affect it
                if(fix.y>0)return; //this object should never push another object down
                if(fix.y<-rect.vy*3)return; //if we have to push it up MORE than it could have reasonably moved in the last 3 frames
            }
            (o.pawn
                ?o.pawn.applyFix(fix)
                :o.applyFix(fix));
            
        });
    };
}