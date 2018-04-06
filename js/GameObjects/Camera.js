function Camera(){
    this.x=0;
    this.y=0;
    this.tx=0;
    this.ty=0;
    this.target=null;
    this.angle=0;
    this.shake=0;
    this.scale=1;
    this.update=function(dt){
        this.updateScreenOffset();
        this.updateTargetXY();
        const speed=5;
        this.x=(this.x+(this.tx-this.x)*dt*speed)|0;
        this.y=(this.y+(this.ty-this.y)*dt*speed)|0;
        if(this.shake>0)this.shake-=dt;
        if(scene.modal&&scene.modal.zoom){
            this.scale+=(2 - this.scale)*dt*5;
        } else if(this.scale!=1){
            this.scale+=(1-this.scale)*dt*10;
        }
        
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
        if(this.shake>0){
            var shake=this.shake;
            shake*=shake;
            shake*=500;
            this.tx+=Math.random()*shake-shake/2;
            this.ty+=Math.random()*shake-shake/2;
        }
    };
    this.drawStart=function(gfx){
        Matrix.push();
        Matrix.translate(this.sx|0,this.sy|0);
        if(this.scale!=1)Matrix.scale(this.scale);
        if(this.angle!=0)Matrix.rotate(this.angle);
        Matrix.translate(-this.x|0,-this.y|0);
    };
    this.drawEnd=function(gfx){
        Matrix.pop();
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