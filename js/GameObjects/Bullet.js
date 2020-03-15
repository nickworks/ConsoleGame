class Bullet {
    constructor(p,v,f,d,g=false){
        this.radius=5;
        this.rect=new Rect(p.x-this.radius,p.y-this.radius,this.radius*2,this.radius*2);
        this.vx=v.x;
        this.vy=v.y;
        this.g=g?400:0;
        this.friend=f;
        this.age=0;
        this.lifespan=3;
        this.dead=false;
        this.dmg=d;
        this.explode=false;
    }
    update(){

        this.vy+=this.g*game.time.dt;
        this.rect.x+=this.vx*game.time.dt;
        this.rect.y+=this.vy*game.time.dt;
        this.age+=game.time.dt;
        if(this.age>this.lifespan)this.dead=true;
    }
    draw(){
        const img = sprites.projectile;
        const p = this.rect.mid();

        //gfx.drawImage(img,p.x-img.width/2,p.y-img.height/2);

        gfx.beginPath();
        gfx.strokeStyle="#FFF";
        gfx.lineWidth=this.radius*2;

        const offsetInSeconds=Math.min(.01,this.age);

        const o={
            x:this.vx*offsetInSeconds,
            y:this.vy*offsetInSeconds,
        };

        gfx.moveTo(p.x+o.x,p.y+o.y);
        gfx.lineTo(p.x-o.x,p.y-o.y);
        gfx.stroke();

        //draw collider:
        //this.rect.draw();
    }
    // check if this bullet is overlapping one or more other objects
    overlap(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            
            if(!o.rect||!o.rect.overlaps(this.rect))return;//return if not overlapping

            this.hit(o);
        });
    }

    hit(o){
        if(o.oneway)return; // ignore oneway platforms
        if(o.mind&&o.mind.friend===this.friend)return; // ignore same allegiance
        if(o.mind){
            o.vx=this.vx>0?200:-200;
            o.vy=-200;
        }
        if(o.hurt)o.hurt(this.dmg); // if the thing has a hurt() function, call it

        if(o.phys&&o.phys.impulse)o.phys.impulse({x:this.vx,y:0});

        this.dead=true; // bullet is dead
        
        const p=this.rect.mid(); // position of bullet        
        if(this.explode==true)scene.explode(p.x,p.y,200,this.dmg);
        scene.addParticles(p.x,p.y,2,5);
    }
}