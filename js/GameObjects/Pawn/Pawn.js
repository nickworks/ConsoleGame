// The Pawn is a body that can be driven by a AIController or PlayerController
class Pawn {
    constructor(raw,canDoubleJump=()=>{return false;}){
        this.rect=new Rect(raw.x||0,raw.y||0,25,45);
        this.a=1200;
        this.vx=0;
        this.vy=0;
        this.maxv=raw.maxv||200;

        this.state=null;
        this.trail=[];
        this.dead=false;
        this.sightRange=raw.s||300;

        // COLLISION FLAGS
        this.onWallLeft=false;
        this.onWallRight=false;
        this.isGrounded=false;
        this.onOneway=false;

        this.airJumpsLeft=1;
        this.airControl=.25;
        this.dir=1; //-1 is left, 1 is right
        this.hp=100;
        this.hpMax=100;
        this.coins=0;
        this.isAsleep=false;

        this.mind = null; // AIController or PlayerController
        
        this.weapon=new Weapon();

        this.canDoubleJump=canDoubleJump;
    }
    draw(){

        if(this.state && this.state.draw) this.state.draw();

        let isFriend = true;

        if(this.mind) {
            this.mind.draw();
            isFriend = this.mind.friend;
        }

        let imgL = isFriend ? sprites.npcL : sprites.enemyL;
        let imgR = isFriend ? sprites.npcR : sprites.enemyR;

        if(this.mind&&this.mind.isPlayer){
            imgL = sprites.playerL;
            imgR = sprites.playerR;            
        }


        const offset = {x:4,y:4};
        const pos = {x:this.rect.x-offset.x,y:this.rect.y-offset.y};
        const img = (this.dir<0)?imgL:imgR;

        if(this.trail.length>0)this.trail.forEach(p=>{
            gfx.drawImage(p.img,p.x-offset.x,p.y-offset.y);
        });
        gfx.drawImage(img,pos.x,pos.y);

        // add to trail:
        //if(this.mind&&this.mind.isPlayer) this.trail.push({img:img,x:this.rect.x,y:this.rect.y});
        //if(this.trail.length > 25) this.trail.splice(0,1);

        // draw collider:
        //this.rect.drawStroke();
    }
    update(){

        if(this.mind) this.mind.update();
        if(!this.state) this.state =new PawnStates.idle(this);
        if(this.state && this.state.update) this.state.update();
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

    }
    // the controller calls moveH() and
    // passes along a max speed multiplier
    // and acceleration multiplier
    moveH(multMaxSpeed=1,multAcceleration=1){
        let move = this.mind&&this.mind.wantsToMove;
        if(!move)move=0;
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

            // turn around fast:
            if(move>0&&this.vx<0)move+=2;
            if(move<0&&this.vx>0)move-=2;
        }

        this.vx+=this.a*move*+multAcceleration*game.time.dt;
        
        // Clamp horizontal velocity:
        const clamp=this.maxv*+multMaxSpeed;
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
    moveV(multMaxSpeed=1,multGravity=1){
        this.vy+=scene.gravity*+multGravity*game.time.dt;
        const terminalVelocity=400*+multMaxSpeed;
        if(this.vy>terminalVelocity)this.vy=terminalVelocity;
        this.rect.y+=this.vy*game.time.dt;
    }
    applyFix(fix,oneway){
        this.rect.x+=fix.x;
        
        if(fix.x!=0){
            this.vx=0;
            if(!this.isGrounded){
                if(fix.x>0){
                    this.onWallLeft=true;
                } else{
                    this.onWallRight=true;
                }
            }
        }
        if(fix.y>0){ // move down:
            this.vy=0;
            this.rect.y+=fix.y;
        }
        if(fix.y<0){ // move up:

            // is the player currently "dropping":
            const isDropping = this.state&&this.state.isDropping?this.state.isDropping():false;

            if(!oneway || !isDropping){
                this.rect.y+=fix.y;
                this.onOneway=oneway;
                this.isGrounded=true;
                this.airJumpsLeft=2;
                this.vy=0;
                //this.isAsleep=true;
                //this.rect.y = 0;
            }
        }
        if(fix.x!=0){
            this.vx=0;
            if(!this.isGrounded){
                if(fix.x>0){
                    this.onWallLeft=true;
                } else{
                    this.onWallRight=true;
                }
            }
        }
        this.rect.cache();
    }
    launch(amt={x:0,y:0}, ignoreInputFor=0){

        if(!ignoreInputFor){ // treat this like a jump
            if(--this.airJumpsLeft < 0) return; // no jumps left
        }

        if(!amt)amt={};
        if(typeof amt.x == "number")this.vx = amt.x;
        if(typeof amt.y == "number")this.vy = amt.y;
        
        this.isGrounded=false;
        this.onWallLeft=false;
        this.onWallRight=false;
        this.state = (!ignoreInputFor) ? new PawnStates.jumping(this) : new PawnStates.launched(this, +ignoreInputFor);
    }
    drop(){
        if(this.onOneway){
            this.isGrounded=false;
            this.state=new PawnStates.inAir(this,true,this.rect.y);
        }
    }
    jump(){ // this pawn has been told to jump
        if(this.state.jump){
            this.state.jump(); // let the current state decide what to do
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