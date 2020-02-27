class Camera {
    constructor(){
        this.x=0;
        this.y=0;
        this.tx=0;
        this.ty=0;
        this.target=null;
        this.angle=0;
        this.shake=0;
        this.scale=1;
        this.cachemouse=null;
    }
    update( scale){
        this.cachemouse=null
        this.updateScreenOffset();
        this.updateTargetXY();
        const speed=5;
        this.x=(this.x+(this.tx-this.x)*game.time.dt*speed)|0;
        this.y=(this.y+(this.ty-this.y)*game.time.dt*speed)|0;
        if(this.shake>0)this.shake-=game.time.dt;

        scale = scale||1;
        this.scale+=(scale - this.scale)*game.time.dt*5;
        
    }
    updateTargetXY(andSnap=true){
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
    }
    drawStart(){
        Matrix.push();
        Matrix.translate(this.sx|0,this.sy|0);
        if(this.scale!=1)Matrix.scale(this.scale);
        if(this.angle!=0)Matrix.rotate(this.angle);
        Matrix.translate(-this.x|0,-this.y|0);
    }
    drawEnd(){
        Matrix.pop();
    }
    updateScreenOffset(){
        this.sx=game.width()/2;
        this.sy=game.height()/2;  
    }
    worldMouse(){        
        if(!this.cachemouse){
            const m=new Matrix();
            m.translate(this.x|0,this.y|0);
            if(this.angle!=0)m.rotate(-this.angle);
            if(this.scale!=1)m.scale(1/this.scale);
            m.translate(-this.sx|0,-this.sy|0);
            this.cachemouse=m.vec({x:mouse.x,y:mouse.y});
        }
        return {x:this.cachemouse.x,y:this.cachemouse.y};
    };
}