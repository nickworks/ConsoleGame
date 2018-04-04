function Particle(x,y){
    this.rect=new Rect(x,y,100,100);
    var a=Math.random()*Math.PI*2;
    var s=Math.random()*750+Math.random()*750;
    this.vs=Math.random();
    this.vx=s*Math.cos(a);
    this.vy=s*Math.sin(a);
    this.ax=0;
    this.ay=0;
    this.drag=50;
    this.dead=false;
    this.life=0;
    this.lifespan=Math.random()*.5+Math.random()*.5;
    this.alpha=1;
    this.scale=Math.random()+1;
    this.update=function(dt){
        this.life+=dt;
        if(this.life>this.lifespan)this.dead=true;
        this.vx+=this.ax*dt;
        this.vy+=this.ay*dt;
        this.rect.x+=this.vx*dt;
        this.rect.y+=this.vy*dt;
        this.vx*=this.drag*dt;
        this.vy*=this.drag*dt;
        this.scale+=this.vs*dt;
        this.alpha=(this.lifespan-this.life)/this.lifespan;
    };
    this.draw=function(gfx){
        const lum=(this.alpha*255)|0;
        gfx.fillStyle="rgba("+lum+","+lum+",0,"+this.alpha+")";
        this.rect.draw(gfx);
        const w=this.rect.w*this.scale;
        const x=this.rect.x-w/2;
        const h=this.rect.h*this.scale;
        const y=this.rect.y-h/2;
        
        gfx.fillRect(x,y,w,h);
    };
}