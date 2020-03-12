class Crate {
    constructor(raw={}){
        this.oid=raw.i||0;
        this.rect=Rect.from(raw);
        this.hp=40;
        this.hasLoot=(Math.random()>.5);

        this.phys=new PhysicsComponent(this);
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
        this.phys.update();
        this.rect.speed();
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
        if(this.dead)return;
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            if(o.rect==this.rect)return; // don't self-check
            //if(o.isAsleep)return;//skip sleeping objects
            if(!o.rect||!o.rect.overlaps(this.rect))return;//return if not overlapping

            const fix=this.rect.findFix(o.rect);

            if(o.constructor.name=="Crate"){
                const v1 = o.phys.getVelMagSq();
                const v2 = this.phys.getVelMagSq();

                const otherIsMovingFaster = (v1 > v2);
                
                o.isAsleep=false;
                this.isAsleep=false;

                if(!otherIsMovingFaster) return; // don't move the other cube

                if(fix.y > 0) {
                    fix.y*=-1;
                    this.applyFix(fix); // move up this crate instead
                    return;
                }
            }
            if(o.constructor.name=="Item"){
                if(fix.y > 0) fix.y*=-1; // crates CAN'T move items down
            }
            o.applyFix(fix,this.oneway);
        });
    }
    hurt(amt){
        this.hp-=amt;

        let r=Math.max(this.rect.w/2,this.rect.h/2);
        r=Math.sqrt(r*r*2);
        const p=this.rect.mid();
        scene.pulse(p.x,p.y,r,0);

        if(this.hp<=0){
            this.dead=true;
            scene.addParticles(p.x,p.y,4,5);
            
            if(this.hasLoot){
                const amt=Math.random()+Math.random()+Math.random();
                scene.spawnLoot((amt*3)|0,this.rect.mid());
            }
        }
    }
    applyFix(fix){
        this.rect.x+=fix.x;
        this.rect.y+=fix.y;
        this.phys.applyFix(fix);
        this.rect.cache();
    }
}