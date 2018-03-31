function Bullet(p,v,f,d,g=false){
    this.rect=new Rect(p.x,p.y,10,10);
    this.vx=v.x;
    this.vy=v.y;
    this.g=g?400:0;
    this.friend=f;
    this.lifespan=3;
    this.dead=false;
    this.dmg=d;
    this.update=function(dt){
        this.vy+=this.g*dt;
        this.rect.x+=this.vx*dt;
        this.rect.y+=this.vy*dt;
        this.lifespan-=dt;
        if(this.lifespan<=0)this.dead=true;
    };
    this.draw=function(gfx){
        
        gfx.drawImage(sprites.projectile,this.rect.x,this.rect.y)
    };
}