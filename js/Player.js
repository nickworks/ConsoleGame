function Player(x,y){
    this.rect = new Rect(x,y,25,25);
    this.vx = 0;
    this.vy = 0;
    this.a = 800;
    this.maxv = 400;
    this.isGrounded=false;
    this.isJumping=false;
    this.airJumpsLeft=1;
    
    this.update=function(dt){
        let grav=1;
        const jumpKeys=[keycode.w,keycode.up];
        if(keyboard.onDown(jumpKeys)){
            if(this.isGrounded)this.jump(false);
            else if(this.airJumpsLeft>0)this.jump(true);
        }
        if(this.isJumping&&keyboard.isDown(jumpKeys)&&this.vy<0){
            grav=.4;
        }else{
            this.isJumping=false;
        }
        this.vy+=800*grav*dt;
        this.move(dt);
        this.isGrounded=false;
    };
    this.draw=function(gfx){
        const r=this.rect;
        gfx.fillRect(r.x,r.y,r.w,r.h);
    };
    this.move=function(dt){
        let move=0;
        let slowDown=false;
        if(keyboard.isDown([keycode.a,keycode.left]))move--;
        if(keyboard.isDown([keycode.d,keycode.right]))move++;
        
        if(move==0){ // if no input, slowdown
            if(this.vx<0)move+=2;
            if(this.vx>0)move-=2;
            slowDown=true;
        }
        
        this.vx+=this.a*move*dt;
        if(this.vx>this.maxv) this.vx=this.maxv;
        if(this.vx<-this.maxv) this.vx=-this.maxv;
        this.rect.x+=this.vx*dt;
        this.rect.y+=this.vy*dt;
        
        if(slowDown){
            if(move<0&&this.vx<0)this.vx=0;
            if(move>0&&this.vx>0)this.vx=0;
        }
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
}