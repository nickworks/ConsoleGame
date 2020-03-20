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
        this.pa1s=.01;
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

        this.easeTowardsGoals();        
    }
    easeTowardsGoals(){
        
        let p1 = Maths.slide(this.pa1s, game.time._dt);
        let p2 = Maths.slide(this.pa1s, game.time._dt);
        this.vals.x=Maths.lerp(this.vals.x,this.goals.x,p1);
        this.vals.y=Maths.lerp(this.vals.y,this.goals.y,p1);
        this.vals.angle=Maths.lerp(this.vals.angle,this.goals.angle,p2);
        this.vals.scale=Maths.lerp(this.vals.scale,this.goals.scale,p2);
    }
    updateGoals(target){
        if(typeof target == "object") this.target = target;

        this.pa1s=.01;
        // for modals:
        if(scene&&scene.guis){
            if(scene.guis.death){
                const m = scene.guis.death;
                this.goals.scale=m.scale;
                this.goals.angle=m.angle;
                return;
            }
            if(scene.guis.modals.length>0){
                this.pa1s=.0001;
                const m = scene.guis.modals[scene.guis.modals.length-1];
                this.goals.x=m.x;
                this.goals.y=m.y;
                if(m.offset)this.goals.x+=+m.offset.x;
                if(m.offset)this.goals.y+=+m.offset.y;
                this.goals.scale=m.scale;
                this.goals.angle=m.angle;
                return;
            }
        }
        this.goals.scale=1;
        this.goals.angle=0;

        if(this.target){
            if(this.target.rect){
                const m=this.target.rect.mid();

                //if(typeof this.target.vx == "number") m.x += this.target.vx * .5;
                //if(typeof this.target.vy == "number") m.y += this.target.vy * .5;


                // for pawn objects:
                if(this.target.mind){

                    m.x += 100*((this.target.dir>0)?1:-1); // focus in front of pawn
                    m.y += -100; // focus above pawn

                    this.goals.x=m.x|0; // ease on x
                    this.goals.scale=1;
                    if(this.target.mind.wantsToDash) this.goals.scale=.9;
                    if(this.target.mind.wantsToCrouch) this.goals.scale=1.3;
                    if(this.target.mind.wantsToAim) this.goals.scale=1.1;

                    const dy = this.goals.y-m.y;
                    if(this.target.isGrounded || dy > 300 || dy < -10)this.goals.y=m.y|0;
                    return;
                }

                // all other objects:
                this.goals.x=m.x|0;
                this.goals.y=m.y|0;

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
            shake*=200;
            this.vals.x+=Math.random()*shake-shake/2;
            this.vals.y+=Math.random()*shake-shake/2;
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