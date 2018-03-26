function Pawn(raw){
    this.rect = new Rect(raw.x||0,raw.y||0,25,25);
    this.vx = 0;
    this.vy = 0;
    this.a = 800;
    this.maxv = 400;
    this.isGrounded=false;
    this.isJumping=false;
    this.airJumpsLeft=1;
    this.dir=1;
    this.jumpCooldown=0;
    this.jumpCooldownAmt=.5;
    this.shootCooldown=0;
    this.shootCooldownAmt=.5;
    this.reloadCooldown=0;
    this.reloadCooldownAmt=3;
    this.ammo=0;
    this.ammoAmt=5
    
    this.draw=function(gfx){
        this.rect.draw(gfx);
    };
    this.update=function(dt){    
        if(this.reloadCooldown>0){
            this.reloadCooldown-=dt;
            if(this.reloadCooldown<=0)this.reload();
        }
        else if(this.shootCooldown>0)this.shootCooldown-=dt;
        
        if(this.isGrounded && this.jumpCooldown>0) this.jumpCooldown-=dt;
        this.isGrounded=false;
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
    this.jump=function(isAirJump=false){ // try to jump...
        if(!isAirJump&&!this.isGrounded)return;
        if(!isAirJump&&this.jumpCooldown>0)return;
        if(isAirJump&&this.airJumpsLeft<=0)return;
        
        this.vy=-300;
        this.isJumping=true;
        this.jumpCooldown=this.jumpCooldownAmt;
        if(isAirJump)this.airJumpsLeft--;
    };
    this.shoot=function(isFriend){
        if(this.reloadCooldown>0)return;
        if(this.shootCooldown>0)return;
        if(!scene.bullets)return;
        
        if(this.ammo>0){
            const b=new Bullet(this.rect.mid(),{x:this.dir*600,y:0},isFriend);
            scene.bullets.push(b);
            this.shootCooldown=this.shootCooldownAmt;
            this.ammo--;
        } else {
            this.reloadCooldown=this.reloadCooldownAmt;
        }
    };
    this.reload=function(){
        this.ammo=this.ammoAmt;
    };
}