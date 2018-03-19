function Camera(){
    this.x=0;
    this.y=0;
    this.tx=0;
    this.ty=0;
    this.update=function(dt, target){
        if(target){
            if(target.rect){
                this.tx=target.rect.x;
                this.ty=target.rect.y;
            } else {
                this.tx=target.x||this.tx;
                this.ty=target.y||this.ty;
            }
        }
        const speed=5;
        this.x+=(this.tx-this.x)*dt*speed;
        this.y+=(this.ty-this.y)*dt*speed;
    };
    this.drawStart=function(gfx){
        gfx.translate(game.width/2-this.x, game.height/2-this.y);
    };
    this.drawEnd=function(gfx){
        gfx.resetTransform();
    }
}