function Camera(){
    this.x=0;
    this.y=0;
    this.tx=0;
    this.ty=0;
    this.sx=game.width/2;
    this.sy=game.height/2;
    this.target=null;
    this.update=function(dt){
        if(this.target){
            if(this.target.rect){
                const m=this.target.rect.mid();
                this.tx=m.x;
                this.ty=m.y;
            } else {
                this.tx=this.target.x||this.tx;
                this.ty=this.target.y||this.ty;
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