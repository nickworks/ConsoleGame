function Player(raw={}){
    var id=raw.i||0;
    this.canDoubleJump=Game.DEVMODE||false;
    this.pawn=new Pawn(raw,()=>{return this.canDoubleJump;});
    this.pawn.jumpCooldownAmt=0;
    this.pawn.agro=true;
    this.hp=100;
    this.hpMax=100;
    this.dead=false;
    this.friend=true;
    this.canWallJump=Game.DEVMODE?function(){return true;}:function(){return false;};
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
        
        if(this.hp<=0||this.dead==true){
            this.dead=true;
            return;
        } else this.dead=false;
        
        if(keyboard.isDown(key.moveLeft()))move--;
        if(keyboard.isDown(key.moveRight()))move++;

        if(keyboard.onDown(key.jump())){
            const onWall=this.pawn.onWallLeft||this.pawn.onWallRight;
            
            if(this.pawn.onOneway&&keyboard.isDown(key.down))this.pawn.drop();
            else if(this.pawn.isGrounded)this.pawn.jump(false);
            else if(onWall&&this.canWallJump())this.pawn.jump(false,true);
            else if(this.pawn.airJumpsLeft>0)this.pawn.jump(true);
        }
        if(!keyboard.isDown(key.jump())){
            this.pawn.isJumping=false;
        }
        
        if(keyboard.isDown(key.attack())) this.pawn.shoot(true);
        
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    };
    this.draw=function(gfx){
        this.pawn.draw(gfx,sprites.playerL,sprites.playerR,{x:4,y:4});
    };
    this.hurt=function(amt=10){
        this.hp-=amt;
    };
    this.heal=function(amt=10){
        this.hp+=amt;
        if(this.hp>this.hpMax)this.hp=this.hpMax;
    };
    this.weapon=function(w){
        if(!w||w.constructor.name!="Weapon")return;
        this.pawn.weapon=w;
        Player.data.weapon=w;
    };
    this.weapon((Player.data.weapon)?Player.data.weapon:this.pawn.weapon);
}
Player.data={
    weapon:null,
    coins:0,
    quests:[],
};
Player.addQuest=function(q){
    
};
Player.checkQuests=function(){
    Player.data.quests.forEach((q)=>{
        //q.onData
    });
};