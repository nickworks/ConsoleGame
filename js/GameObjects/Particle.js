class Particle {


    static Type = {
        BOOM: 1,
        HIT: 2,
        DUST: 3,
        CRATE: 4,
    }

    constructor(x,y,t=1){
        
        this.life=this.lifespan=0;
        
        this.rect=new Rect(x,y,100,100);
        this.v={x:0,y:0};
        this.a={x:0,y:0};
        this.drag=0;
        
        this.scale=1;
        this.scalev=0;
        
        this.alpha=1;
        this.fadeOut=true;
        
        this.angle=0;
        this.anglev=0;
        
        this.color="#000";
        this.init(t);
    }
    
    init(t){
        this.t = t;
        const randDir=(s=1)=>{
            const a=Math.random()*Math.PI*2;
            return {
                x:s*Math.cos(a),
                y:s*Math.sin(a)
            };
        };
        const randBox=(sx=1,sy=1)=>{
            return {
                x:Math.random()*sx-sx/2,
                y:Math.random()*sy-sy/2
            };
        };
        const rand=(min,max)=>{
            return Math.random()*(max-min)+min;
        };
        // TODO: Maybe move this into /data/ folder?
        switch(t){
            case Particle.Type.BOOM:
                var scale=rand(0,750)+rand(0,750);
                this.v=randDir(scale);
                this.drag=.2;
                this.scale=rand(.5,1);
                this.scalev=rand(0,1);
                this.lifespan=rand(0,.5)+rand(0,.5);
                break;
            case Particle.Type.HIT:
                this.v={x:rand(-800,800),y:rand(-500,-100)};
                this.a.y=1600;
                this.scalev=0;
                this.rect.w=this.rect.h=rand(5, 15);
                this.lifespan=rand(.5,1.5);
                break;
            case Particle.Type.DUST:
                this.v=randDir(rand(0,800));
                this.drag=.1;
                this.lifespan=rand(.5,1);
                this.rect.w=this.rect.h=rand(20,30);
                this.alpha=.5;
                break;
            case Particle.Type.CRATE:
                this.v={x:rand(-400,400),y:rand(-800,-300)};
                this.lifespan=rand(.5,2);
                this.rect.w=this.rect.h=rand(20,40);
                this.a.y=rand(1200,2000);
                this.angle=rand(0,Math.PI);
                this.anglev=rand(-5,5);
                const hue=rand(10,30);
                const sat=rand(55,65)|0;
                const lit=rand(45,50)|0;
                this.color="hsl("+hue+", "+sat+"%, "+lit+"%)";
        }
    }
    update(){
        this.life+=game.time.dt;
        if(this.life>this.lifespan)this.dead=true;
        this.v.x+=this.a.x*game.time.dt;
        this.v.y+=this.a.y*game.time.dt;
        this.rect.x+=this.v.x*game.time.dt;
        this.rect.y+=this.v.y*game.time.dt;
        this.v.x-=this.v.x*this.drag;
        this.v.y-=this.v.y*this.drag;
        this.scale+=this.scalev*game.time.dt;
        
    }
    draw(gfx){
        var a=this.alpha;
        if(this.fadeOut)a*=(this.lifespan-this.life)/this.lifespan;
        switch(this.t){
            case Particle.Type.BOOM:
                const lum=(this.alpha*255)|0;
                gfx.fillStyle="rgba("+lum+","+lum+",0,"+a+")";
                break;
            case Particle.Type.HIT:
                gfx.fillStyle="rgba(0,0,0,"+a+")";
                break;
            case Particle.Type.DUST:
                gfx.fillStyle="rgba(100,50,25,"+a+")";
                break;
            default:
                gfx.fillStyle=this.color;
        }
        const w=this.rect.w*this.scale;
        const x=-w/2;
        const h=this.rect.h*this.scale;
        const y=-h/2;
        Matrix.push();
        Matrix.translate(this.rect.x, this.rect.y);
        if(this.scale!=1)Matrix.scale(this.scale);
        if(this.angle!=0)Matrix.rotate(this.angle);
        gfx.fillRect(x,y,w,h);
        Matrix.pop();
    }
}