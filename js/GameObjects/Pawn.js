// The Pawn is a body that can be driven by a AIController or PlayerController
class Pawn {
    constructor(raw,canDoubleJump=()=>{return false;}){
        this.rect=new Rect(raw.x||0,raw.y||0,25,45);
        this.sightRange=raw.s||300;
        this.vx=0;
        this.vy=0;
        this.a=1200;
        this.maxv=raw.maxv||200;
        this.walking=false;
        this.onWallLeft=false;
        this.onWallRight=false;
        this.isGrounded=false;
        this.isSliding=false;
        this.isJumping=false;
        this.onOneway=false;
        this.airJumpsLeft=1;
        this.dir=1;
        
        this.isDropping=false;
        this.isAsleep=false;
        this.dropFrom=0;
        
        this.weapon=new Weapon();

        this.canDoubleJump=canDoubleJump;

    }
    draw(gfx,imgL, imgR,o){
        gfx.drawImage((this.dir<0)?imgL:imgR,this.rect.x-o.x,this.rect.y-o.y);
    }
    update(dt){    
        if(this.weapon)this.weapon.update(dt); 
        if(this.isGrounded&&this.jumpCooldown>0) this.jumpCooldown-=dt;
        this.isGrounded=false;
        this.onWallLeft=false;
        this.onWallRight=false;
        this.isSliding=false;
        this.onOneway=false;
        if(this.isDropping&&this.rect.y>this.dropFrom+20)this.isDropping=false;
        this.rect.speed();
    }
    moveH(dt,move=0){
        let slowDown=false;            
        if(move==0){ // if no input
            if(this.isGrounded){
                if(this.vx<0)move+=2;
                if(this.vx>0)move-=2;
                slowDown=true;
            }
        } else {
            this.dir=move;
            if(move>0&&this.vx<0)move+=2;
            if(move<0&&this.vx>0)move-=2;
        }
        if(!this.isGrounded)move*=.4;//40% air control
        // Clamp horizontal velocity:
        this.vx+=this.a*move*dt;
        var clamp=(this.walking)?this.maxv/2:this.maxv;
        if(!this.isGrounded)this.clamp=this.maxv*2;
        if(this.vx>clamp)this.vx=clamp;
        if(this.vx<-clamp)this.vx=-clamp;
        // Apply velocity:
        this.rect.x+=this.vx*dt;
        // Prevent ping-ponging:
        if(slowDown){
            if(move<0&&this.vx<0)this.vx=0;
            if(move>0&&this.vx>0)this.vx=0;
        }
    }
    moveV(dt){
        let grav=1;
        if(this.isJumping&&this.vy<0){
            grav=.4;
        }else{
            //if(this.onWallLeft||this.onWallRight)grav=.2;
            this.isJumping=false;
        }
        
        this.vy+=1200*grav*dt;
        const terminalVelocity=(this.onWallLeft||this.onWallRight)?150:400
        if(this.vy>terminalVelocity)this.vy=terminalVelocity;
        this.rect.y+=this.vy*dt;
    }
    applyFix(fix,oneway){
        this.rect.x+=fix.x;
        
        if(fix.x!=0){
            this.vx=0;
            if(fix.x>0){
                this.onWallLeft=true;
            } else{
                this.onWallRight=true;
            }
        }
        if(fix.y>0){
            this.vy=0;
            this.rect.y+=fix.y;
        }
        if(fix.y<0){
            if(!oneway||!this.isDropping){
                this.rect.y+=fix.y;
                this.onOneway=oneway;
                this.isGrounded=true;
                this.airJumpsLeft=1;
                this.vy=0;
                this.isAsleep=true;
            }
        }
        this.rect.cache();
    }
    jump(isAirJump=false,isWallJump=false){ // try to jump...
        
        if(isWallJump&&!this.isGrounded){
            if(this.onWallLeft){
                this.vy=-400;
                this.vx=400;
                this.isJumping=true;    
                return;
            }
            if(this.onWallRight){
                this.vy=-400;
                this.vx=-400;
                this.isJumping=true;    
                return;
            }
        }
        if(!isAirJump&&!this.isGrounded)return;
        if(!isAirJump&&this.jumpCooldown>0)return;
        if(isAirJump&&this.airJumpsLeft<=0)return;
        if(isAirJump&&!this.canDoubleJump())return;
        
        this.vy=-350;
        this.isJumping=true;
        this.jumpCooldown=this.jumpCooldownAmt;
        if(isAirJump)this.airJumpsLeft--;
    }
    drop(){
        if(!this.isDropping){
            this.dropFrom=this.rect.y;
            this.isDropping=true;
        }
    }
    shoot(isFriend){
        if(this.weapon){
            let p=this.rect.mid();
            this.weapon.shoot(p, this.dir, isFriend);
        }
    }
    canSee(o,h=20){
        const w=this.sightRange;
        const x=this.rect.x-((this.dir<0)?w:0);
        const y=this.rect.y+h/4;
        return Rect.from({x:x,y:y,w:w,h:h}).overlaps(o);
    }
}