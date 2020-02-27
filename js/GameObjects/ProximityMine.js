class ProximityMine {
	constructor(raw={}){
		this.oid=raw.i||0;
        this.x=raw.x||0;
        this.y=raw.y||0;
		this.radius=raw.r||400;
		this.hp=1;
		this.rect={};
	}
	update(){
		const r = this.radius;
		this.rect = new Rect(this.x-r, this.y-r, r+r, r+r);
	}
	draw(){
		gfx.fillStyle="#F00";
		gfx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
		
	}
	// check if this mine is overlapping one or more other objects
    overlap(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping

            this.boom(o);
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