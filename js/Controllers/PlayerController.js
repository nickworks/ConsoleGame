class PlayerController extends Controller {

    static data={
        weapon:null,
        coins:0,
        quests:[],
    };
    static addQuest(q){
        
    }
    static checkQuests(){
        PlayerController.data.quests.forEach((q)=>{
            //q.onData
        });
    }

    constructor(raw={}){
        super();
        raw.maxv=300;
        this.oid=raw.i||0;
        this.canDoubleJump=Game.DEVMODE||false;
        this.pawn=new Pawn(raw,()=>{return this.canDoubleJump;});
        this.pawn.jumpCooldownAmt=0;
        this.hp=100;
        this.hpMax=100;
        this.dead=false;
        this.friend=true;
        this.canWallJump=Game.DEVMODE ? ()=>{return true;} : ()=>{return false;};
        this.weapon((PlayerController.data.weapon)?PlayerController.data.weapon:this.pawn.weapon);
        if(Game.DEVMODE)this.weapon(new Weapon({t:5}));
    }
    serialize(){
        return{
            i:this.oid,
            x:this.pawn.rect.x|0,
            y:this.pawn.rect.y|0,
        };
    }
    id(i){
        if(i)this.oid=i;
        return this.oid;  
    }
    update(dt){
        
        if(typeof this.canWallJump!="function"){
            game.console.log("/* Careful there!\n * scene.player.canWallJump() is a function.\n * Changing a function can introduce bugs that CRASH\n * THE GAME. There may not be any coming back from a crashed game...\n * so be careful! Perhaps you should visit the Western guru to\n * learn more about functions.\n */");
            this.canWallJump=()=>{return false};
        } 
        
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
    }
    draw(gfx){
        this.pawn.draw(gfx,sprites.playerL,sprites.playerR,{x:4,y:4});
    }
    hurt(amt=10){
        this.hp-=amt;
    }
    heal(amt=10){
        this.hp+=amt;
        if(this.hp>this.hpMax)this.hp=this.hpMax;
    }
    weapon(w){
        if(!w||w.constructor.name!="Weapon")return;
        this.pawn.weapon=w;
        PlayerController.data.weapon=w;
    }
}