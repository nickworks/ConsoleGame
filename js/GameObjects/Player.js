function Player(raw={}){
    var id=raw.i||0;
    this.canDoubleJump=true;
    this.pawn=new Pawn(raw,()=>{return this.canDoubleJump;});
    this.pawn.jumpCooldownAmt=0;
    this.hp=100;
    this.dead=false;
    this.friend=true;
    this.canWallJump=function(){
        return true;  
    };
    this.serialize=function(){
        return{
            i:id,
            x:this.pawn.rect.x|0,
            y:this.pawn.rect.y|0,
        };
    };
    this.id=function(i){
        if(i)id=i;
        return id;  
    };
    this.update=function(dt){    
        let move=0;
        let slowDown=false;
        if(keyboard.isDown(key.moveLeft()))move--;
        if(keyboard.isDown(key.moveRight()))move++;

        if(keyboard.onDown(key.jump())){
            const onWall=this.pawn.onWallLeft||this.pawn.onWallRight;
            
            if(this.pawn.isGrounded)this.pawn.jump(false);
            else if(onWall&&this.canWallJump())this.pawn.jump(false,true);
            else if(this.pawn.airJumpsLeft>0)this.pawn.jump(true);
        }
        if(!keyboard.isDown(key.jump())){
            this.pawn.isJumping=false;
        }
        
        if(keyboard.isDown(key.attack())) this.pawn.shoot(true);
        
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
    };
}