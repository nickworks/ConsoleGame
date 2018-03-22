function Bullet(p,v,g=false){
    this.rect=new Rect(p.x,p.y,10,10);
    this.vx=v.x;
    this.vy=v.y;
    this.g=g?400:0;
    this.update=function(dt){
        this.vy+=this.g*dt;
        this.x+=this.vx*dt;
        this.y+=this.vy*dt;
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);
    };
}