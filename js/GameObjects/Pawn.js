function Pawn(x,y){
    this.rect = new Rect(x,y,25,25);
    this.vx = 0;
    this.vy = 0;
    this.a = 800;
    this.maxv = 400;
    this.isGrounded=false;
    this.isJumping=false;
    this.airJumpsLeft=1;
    this.dir=1;
    
    this.draw=function(gfx){
        this.rect.draw(gfx);
    };
    this.moveH=function(dt,move=0){
        let slowDown=false;
        if(move==0){ // if no input, slowdown
            if(this.vx<0)move+=2;
            if(this.vx>0)move-=2;
            slowDown=true;
        } else {
            this.dir=move;
        }
        this.vx+=this.a*move*dt;
        if(this.vx>this.maxv)this.vx=this.maxv;
        if(this.vx<-this.maxv)this.vx=-this.maxv;
        this.rect.x+=this.vx*dt;
        if(slowDown){
            if(move<0&&this.vx<0)this.vx=0;
            if(move>0&&this.vx>0)this.vx=0;
        }
    };
    this.moveV=function(dt){
        let grav=1;
        if(this.isJumping&&this.vy<0){
            grav=.4;
        }else{
            this.isJumping=false;
        }
        this.vy+=800*grav*dt;
        this.rect.y+=this.vy*dt;
        this.isGrounded=false;
    };
    this.fixOverlap=function(rect){
        if(!this.rect.overlaps(rect))return;//return if not overlapping
        const fix=rect.findFix(this.rect);
        this.applyFix(fix);
    };
    this.applyFix=function(fix){
        this.rect.x+=fix.x;
        this.rect.y+=fix.y;
        if(fix.x!=0){
            this.vx=0;
        }
        if(fix.y!=0){
            this.vy=0;
            if(fix.y<0){
                this.isGrounded=true;
                this.airJumpsLeft=1;
            }
        }
    };
    this.jump=function(isAirJump){
        this.vy=-300;
        this.isJumping=true;
        if(isAirJump)this.airJumpsLeft--;
    };
    this.shoot=function(){
        const b=new Bullet(this.rect.mid(),{x:this.dir*600,y:0});
        if(scene.bullets)scene.bullets.push(b);
    };
}