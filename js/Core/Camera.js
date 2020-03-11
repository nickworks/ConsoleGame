class Camera {
    constructor(){
        this.vals={
            x:0,
            y:0,
            angle:0,
            scale:.5,
            
        };
        this.goals={
            x:0,
            y:0,
            angle:0,
            scale:1,
        };
        this.screenOffset={x:0,y:0};
        this.target=null;
        this.shake=0;
        this.cachemouse=null;
    }
    update(){
        this.cachemouse=null
        this.updateScreenOffset();
        this.updateGoals();
        this.doShake();
        

        const pa1s=.001;
        let p = Maths.slide(.01, game.time._dt);
        let p2 = Maths.slide(.05, game.time._dt);

        this.vals.x=Maths.lerp(this.vals.x,this.goals.x,p);
        this.vals.y=Maths.lerp(this.vals.y,this.goals.y,p);
        this.vals.angle=Maths.lerp(this.vals.angle,this.goals.angle,p);
        this.vals.scale=Maths.lerp(this.vals.scale,this.goals.scale,p);

        
    }
    updateGoals(target){
        if(typeof target == "object") this.target = target;
        if(this.target){
            if(this.target.rect){
                const m=this.target.rect.mid();

                if(typeof this.target.vx == "number") m.x += this.target.vx * .2;
                if(typeof this.target.vy == "number") m.y += this.target.vy * .2;

                this.goals.x=(m.x)|0;
                this.goals.y=(m.y-50)|0;
            } else {
                this.goals.x=this.target.x||this.goals.x;
                this.goals.y=this.target.y||this.goals.y;
            }
        }

    }
    doShake(){
        if(this.shake>0){
            this.shake-=game.time.dt; 
            var shake=this.shake;
            shake*=shake;
            shake*=500;
            this.goals.x+=Math.random()*shake-shake/2;
            this.goals.y+=Math.random()*shake-shake/2;
        }
    }
    // The camera is automatically snapped
    // to it's target position, scale, rotation.
    // This can be used to create a camera cut.
    cut(){
        this.vals.x=this.goals.x;
        this.vals.y=this.goals.y;
        this.vals.angle=this.goals.angle;
        this.vals.scale=this.goals.scale;
    }
    drawStart(){
        Matrix.push();
        Matrix.translate(this.screenOffset.x|0,this.screenOffset.y|0);
        if(this.vals.scale!=1)Matrix.scale(this.vals.scale);
        if(this.vals.angle!=0)Matrix.rotate(this.vals.angle);
        Matrix.translate(-this.vals.x|0,-this.vals.y|0);
    }
    drawEnd(){
        Matrix.pop();
    }
    updateScreenOffset(){
        this.screenOffset.x=game.width()/2;
        this.screenOffset.y=game.height()/2;  
    }
    worldMouse(){        
        if(!this.cachemouse){
            const m=new Matrix();
            m.translate(this.vals.x|0,this.vals.y|0);
            if(this.vals.angle!=0)m.rotate(-this.vals.angle);
            if(this.vals.scale!=1)m.scale(1/this.vals.scale);
            m.translate(-this.screenOffset.x|0,-this.screenOffset.y|0);
            this.cachemouse=m.vec({x:mouse.x,y:mouse.y});
        }
        return {x:this.cachemouse.x,y:this.cachemouse.y};
    };
}