function Platform(raw={}){
    var id=raw.id||0;
    this.rect=Rect.from(raw);
    this.oneway=(!!raw.o);
    this.slippery=(!!raw.s);
    this.serialize=function(){
        const data={
            i:id,
            x:this.rect.x,
            y:this.rect.y,
            w:this.rect.w,
            h:this.rect.h,
        };
        if(this.oneway)data.o=1;
        if(this.slippery)data.s=1;
        return data;
    };
    this.id=function(i){
        if(i)id=i;
        return id;  
    };
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle=this.oneway?sprites.tiles2:sprites.tiles;
        
        gfx.beginTransform();
        gfx.translate(this.rect.x,this.rect.y);
        //this.rect.draw(gfx);
        gfx.fillRect(0,0,this.rect.w,this.rect.h);
        gfx.endTransform();
    };
    this.block=function(a, dt){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            if(o.isAsleep)return;//skip sleeping objects
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping
            const fix=this.rect.findFix(rect);
            if(this.oneway){
                fix.x=0;
                //when should we IGNORE vertical fixes?
                if(rect.vy<=0)return; //if the object is moving UP, this platform shouldn't affect it
                if(fix.y>0)return; //this object should never push another object down
                if(fix.y<-rect.vy*3)return; //if we have to push it up MORE than it could have reasonably moved in the last 3 frames
            }
            (o.pawn
                ?o.pawn.applyFix(fix,this.slippery)
                :o.applyFix(fix,this.slippery));
            
        });
    };
}