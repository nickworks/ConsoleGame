function Crate(raw={}){
    var id=raw.i||0;
    this.rect=Rect.from(raw);
    this.hp=50;
    this.dead=false;
    this.hasLoot=(Math.random()>.5);
    this.serialize=function(){
        const data={
            i:id,
            x:this.rect.x|0,
            y:this.rect.y|0,
            w:this.rect.w|0,
            h:this.rect.h|0,
        };
        return data;
    };
    this.id=function(i){
        if(i)id=i;
        return id;
    };
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        this.rect.draw(gfx);
        Matrix.push();
        Matrix.translate(this.rect.x,this.rect.y);
        Matrix.scale(this.rect.w/100);
        gfx.drawImage(sprites.crate,0,0);
        Matrix.pop();
    };
    this.block=function(a, dt){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            if(o.isAsleep)return;//skip sleeping objects
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping
            const fix=this.rect.findFix(rect);
            (o.pawn
                ?o.pawn.applyFix(fix,this.oneway)
                :o.applyFix(fix,this.oneway));
            
        });
    };
    this.hurt=function(amt){
        this.hp-=amt;
        if(this.hp<=0)this.dead=true;
    };
}