function Camera(){
    this.x=0;
    this.y=0;
    this.tx=0;
    this.ty=0;
    this.sx=game.width/2;
    this.sy=game.height/2;
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
        gfx.translate(this.sx-this.x,this.sy-this.y);
    };
    this.drawEnd=function(gfx){
        gfx.resetTransform();
    };
    this.worldMouse=function(){
        return {
            x:mouse.x-(this.sx-this.x),
            y:mouse.y-(this.sy-this.y)
        };
    };
}