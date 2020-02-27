class ProximityMine {
	constructor(raw={}){
		this.oid=raw.i||0;
        this.x=raw.x||0;
        this.y=raw.y||0;
		this.radius=raw.r||400;
		this.hp=1;
	}
	update(){

	}
	draw(gfx){
		gfx.fillStyle="#F00";


		const r = this.radius;
		const x=this.x-r;
		const y=this.y-r;
		const w=r+r;
		const h=w;


		gfx.fillRect(x, y, w, h);
		
	}
	hurt(amt){
        this.hp-=amt;
        if(this.hp<=0){
            this.dead=true;
            const p=this.rect.mid();
            scene.addParticles(p.x,p.y,Particle.Type.BOOM,5);
        }
    }
}