function Player(raw={}){
    this.id=raw.i||0;
    this.canDoubleJump=true;
    this.pawn=new Pawn(raw,()=>{return this.canDoubleJump;});
    this.pawn.jumpCooldownAmt=0;
    this.hp=100;
    this.dead=false;
    this.friend=true;
    this.serialize=function(){
        return{
            x:this.pawn.rect.x,
            y:this.pawn.rect.y
        };
    };
    this.update=function(dt){    
        let move=0;
        let slowDown=false;
        if(keyboard.isDown([keycode.a,keycode.left]))move--;
        if(keyboard.isDown([keycode.d,keycode.right]))move++;

        const jumpKeys=[keycode.w,keycode.up];
        if(keyboard.onDown(jumpKeys)){
            if(this.pawn.isGrounded)this.pawn.jump(false);
            else if(this.pawn.airJumpsLeft>0)this.pawn.jump(true);
        }
        if(!keyboard.isDown(jumpKeys)){
            this.pawn.isJumping=false;
        }
        
        if(keyboard.isDown(keycode.space)) this.pawn.shoot(true);
        
        this.pawn.agro=true;
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    };
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        this.pawn.draw(gfx);
    };
    this.hurt=function(amt){
        this.hp-=amt;
        if(this.hp<=0)this.dead=true;
    }
}


