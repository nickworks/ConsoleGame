class ProximityMine {
	constructor(raw={}){
		this.oid=raw.i||0;
        this.x=raw.x||0;
        this.y=raw.y||0;
		this.radius=raw.r||400;
		this.hp=1;
		this.rect={};
        this.fuseLit=false;
        this.fuseTimer=.5;
	}
	update(){
		const r = this.radius;
		this.rect = new Rect(this.x-r, this.y-r, r+r, r+r);
        if(this.fuseLit){
            if(this.fuseTimer>0)this.fuseTimer-=game.time.dt;
            else this.boom();
        }
	}
	draw(){
        const mid = this.rect.mid();
		gfx.fillStyle="#F00";
		gfx.fillCircle(mid.x, mid.y, this.radius);
	}
	// check if this mine is overlapping one or more other objects
    overlap(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            
            // return if rects not overlapping
            if(!o.rect||!o.rect.overlaps(this.rect))return;

            // return if centers are further away than length of this.radius
            if(Maths.magSq(o.rect.mid(), this.rect.mid()) > this.radius * this.radius) return;

            this.fuseLit=true;
        });
    }
    boom(){
    	this.dead=true;
        const p=this.rect.mid();
    	scene.explode(p.x, p.y, this.radius*2, 100);
    }
	hurt(amt){
        this.hp-=amt;
        if(this.hp<=0 && !this.dead) this.boom();
    }
}