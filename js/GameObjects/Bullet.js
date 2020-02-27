class Bullet {
    constructor(p,v,f,d,g=false){
        this.rect=new Rect(p.x,p.y,10,10);
        this.vx=v.x;
        this.vy=v.y;
        this.g=g?400:0;
        this.friend=f;
        this.lifespan=3;
        this.dead=false;
        this.dmg=d;
        this.explode=false;
    }
    update(){

        this.vy+=this.g*game.time.dt;
        this.rect.x+=this.vx*game.time.dt;
        this.rect.y+=this.vy*game.time.dt;
        this.lifespan-=game.time.dt;
        if(this.lifespan<=0)this.dead=true;
    }
    draw(){
        gfx.drawImage(sprites.projectile,this.rect.x,this.rect.y)
    }
    // check if this bullet is overlapping one or more other objects
    overlap(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping

            this.hit(o);            
        });
    }

    hit(o){
        if(o.oneway)return; // ignore oneway platforms
        if(o.friend===this.friend)return; // ignore same allegiance
        if(o.pawn){
            o.pawn.vx=this.vx>0?200:-200;
            o.pawn.vy=-200;
        }
        if(o.hurt)o.hurt(this.dmg); // if the thing has a hurt() function, call it

        this.dead=true; // bullet is dead
        
        const p=this.rect.mid(); // position of bullet        
        if(this.explode==true)scene.explode(p.x,p.y,200,this.dmg);
        scene.addParticles(p.x,p.y,2,5);
    }
}