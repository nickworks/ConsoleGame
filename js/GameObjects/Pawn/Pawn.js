// The Pawn is a body that can be driven by a AIController or PlayerController
class Pawn {
    constructor(raw,canDoubleJump=()=>{return false;}){
        this.rect=new Rect(raw.x||0,raw.y||0,25,45);
        this.a=1200;
        this.vx=0;
        this.vy=0;
        this.maxv=raw.maxv||200;

        this.state=null;

        this.dead=false;
        this.sightRange=raw.s||300;

        this.walking=false; // whether or not the pawn is sprinting
        this.onWallLeft=false; // whether or not the pawn is pressed up against the left wall
        this.onWallRight=false; // whether or not the pawn is pressed up against the right wall
        this.isGrounded=false; // whether or not the pawn is on the ground
        this.isJumping=false;
        this.onOneway=false;

        this.airJumpsLeft=1;
        this.dir=1; //-1 is left, 1 is right
        this.hp=100;
        this.hpMax=100;
        this.coins=0;
        this.isDropping=false;
        this.isAsleep=false;
        this.dropFrom=0;

        this.mind = null; // AIController or PlayerController

        this.input = {
            move:0,         // an axis for left/right walking
            jump:false,     // whether or not "jump" is held
        }
        
        this.weapon=new Weapon();

        this.canDoubleJump=canDoubleJump;
    }
    draw(){

        if(this.state && this.state.draw) this.state.draw(this);

        let isFriend = true;

        if(this.mind) {
            this.mind.draw();
            isFriend = this.mind.friend;
        }

        const imgL = isFriend ? sprites.playerL : sprites.enemyL;
        const imgR = isFriend ? sprites.playerR : sprites.enemyR;

        //gfx.fillStyle="#F00";
        //this.rect.draw(); // draw collider

        const o = {x:4,y:4};
        gfx.drawImage((this.dir<0)?imgL:imgR,this.rect.x-o.x,this.rect.y-o.y);
    }
    update(){

        this.input.move = 0;

        if(this.mind) this.mind.update();
        if(!this.state) this.state = PawnStates.idle;
        if(this.state && this.state.update) this.state.update(this);
        if(this.weapon) this.weapon.update();

        if(this.hp<=0){
            this.die();
            return;
        }

        this.clearFlags(); // clear what collision detection is going to set
        
        this.rect.speed();
    }
    clearFlags(){
        if(this.isGrounded&&this.jumpCooldown>0) this.jumpCooldown-=game.time.dt;
        this.isGrounded=false;
        this.onWallLeft=false;
        this.onWallRight=false;
        this.onOneway=false;
        if(this.isDropping&&this.rect.y>this.dropFrom+20)this.isDropping=false;
    }
    // the controller calls moveH() and
    // passes along what direction
    // the controller wants to move in
    moveH(move=0){
        let slowDown=false;            
        if(move==0){ // if no input
            if(this.isGrounded){
                if(this.vx!=0) move = (this.vx<0) ? 1 : -1;
                //if(this.vx<0)move+=2;
                //if(this.vx>0)move-=2;
                slowDown=true;
            }
        } else {
            this.dir=move;
            if(move>0&&this.vx<0)move+=2;
            if(move<0&&this.vx>0)move-=2;
        }
        if(!this.isGrounded)move*=.4;//40% air control
        // Clamp horizontal velocity:
        this.vx+=this.a*move*game.time.dt;
        var clamp=(this.walking)?this.maxv/2:this.maxv;
        if(!this.isGrounded)this.clamp=this.maxv*2;
        if(this.vx>clamp)this.vx=clamp;
        if(this.vx<-clamp)this.vx=-clamp;
        // Apply velocity:
        this.rect.x+=this.vx*game.time.dt;
        // Prevent ping-ponging:
        if(slowDown){
            if(move<0&&this.vx<0)this.vx=0;
            if(move>0&&this.vx>0)this.vx=0;
        }
    }
    moveV(mult=1){
        mult=+mult;
        this.vy+=scene.gravity*mult*game.time.dt;
        const terminalVelocity=(this.onWallLeft||this.onWallRight)?150:400
        if(this.vy>terminalVelocity)this.vy=terminalVelocity;
        this.rect.y+=this.vy*game.time.dt;
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
        if(fix.y>0){ // move down:
            this.vy=0;
            this.rect.y+=fix.y;
        }
        if(fix.y<0){ // move up:
            if(!oneway||!this.isDropping){
                this.rect.y+=fix.y;
                this.onOneway=oneway;
                this.isGrounded=true;
                this.airJumpsLeft=1;
                this.vy=0;
                //this.isAsleep=true;
                //this.rect.y = 0;
            }
        }
        this.rect.cache();
    }
    launch(amt={x:0,y:0}, isJump=false){
        if(!amt)amt={};
        if(typeof amt.x == "number")this.vx = amt.x;
        if(typeof amt.y == "number")this.vy = amt.y;
        
        
        this.state = (isJump) ? PawnStates.jumping : PawnStates.inAir;
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
    hurt(amt=10){
        if(this.mind)this.mind.notify();
        this.hp-=amt;
    }
    heal(amt=10){
        this.hp+=amt;
        if(this.hp>this.hpMax)this.hp=this.hpMax;
    }
    die(){
        if(this.dead) return;
        if(this.mind){
            if(this.mind.callbacks) Callback.do(this.mind.callbacks.onDeath);
            const r=this.rect;
            const raw={x:r.x,y:r.y};
            scene.spawnLoot(3,raw);
        }
        this.dead=true;
    }
}