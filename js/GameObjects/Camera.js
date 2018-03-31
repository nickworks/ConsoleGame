function Camera(){
    this.x=0;
    this.y=0;
    this.tx=0;
    this.ty=0;
    this.target=null;
    this.update=function(dt){
        this.updateScreenOffset();
        this.updateTargetXY();
        const speed=5;
        this.x=(this.x+(this.tx-this.x)*dt*speed)|0;
        this.y=(this.y+(this.ty-this.y)*dt*speed)|0;
    };
    this.updateTargetXY=function(andSnap=true){
        if(this.target){
            if(this.target.rect){
                const m=this.target.rect.mid();
                this.tx=(m.x)|0;
                this.ty=(m.y-50)|0;
            } else {
                this.tx=this.target.x||this.tx;
                this.ty=this.target.y||this.ty;
            }
            if(andSnap){
                this.x=this.tx;
                this.y=this.ty;
            }
        }
    };
    this.drawStart=function(gfx){
        const x=(this.sx-this.x)|0;
        const y=(this.sy-this.y)|0;
        gfx.beginTransform();
        gfx.translate(x,y);
    };
    this.drawEnd=function(gfx){
        gfx.endTransform();
    };
    this.updateScreenOffset=function(){
        this.sx=game.width()/2;
        this.sy=game.height()/2;  
    };
    this.worldMouse=function(){
        return {
            x:mouse.x-(this.sx-this.x),
            y:mouse.y-(this.sy-this.y)
        };
    };
}