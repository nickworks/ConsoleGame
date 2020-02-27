class Crate {
    constructor(raw={}){
        this.oid=raw.i||0;
        this.rect=Rect.from(raw);
        this.hp=40;
        this.hasLoot=(Math.random()>.5);
    }
    serialize(){
        const data={
            i:this.oid,
            x:this.rect.x|0,
            y:this.rect.y|0,
            w:this.rect.w|0,
            h:this.rect.h|0,
        };
        return data;
    }
    id(i){
        if(i)this.oid=i;
        return this.oid;
    }
    update(){
        
    }
    draw(){
        gfx.fillStyle="#000";
        this.rect.draw();
        Matrix.push();
        Matrix.translate(this.rect.x,this.rect.y);
        Matrix.scale(this.rect.w/100);
        gfx.drawImage(sprites.crate,0,0);
        Matrix.pop();
    }
    block(a){
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
    }
    hurt(amt){
        this.hp-=amt;
        if(this.hp<=0){
            this.dead=true;
            const p=this.rect.mid();
            scene.addParticles(p.x,p.y,4,5);
            if(this.hasLoot){
                const amt=Math.random()+Math.random()+Math.random();
                scene.spawnLoot((amt*3)|0,this.rect.mid());
            }
        }
    }
}