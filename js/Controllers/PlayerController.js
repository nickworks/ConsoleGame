class PlayerController extends Controller {

    static data={
        weapon:null,
        coins:0,
        quests:[],
        reset(){
            this.weapon=null;
            this.coins=0;
            this.quests=[];
            game.console.log("player data reset");
        }
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
        this.pawn.mind=this;
        this.pawn.jumpCooldownAmt=0;
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
    update(){
        
        
        // control the pawn's horizontal movement:
        let move=0;
        if(keyboard.isDown(key.moveLeft()))move--;
        if(keyboard.isDown(key.moveRight()))move++;
        this.pawn.move = move;

        // make the pawn jump:
        if(keyboard.onDown(key.jump())){
            const onWall=this.pawn.onWallLeft||this.pawn.onWallRight;
            
            if(this.pawn.onOneway&&keyboard.isDown(key.crouch()))this.pawn.drop();
            else if(this.pawn.isGrounded)this.pawn.jump(false);
            else if(onWall&&this.canWallJump())this.pawn.jump(false,true);
            else if(this.pawn.airJumpsLeft>0)this.pawn.jump(true);
        }
        if(!keyboard.isDown(key.jump())){
            this.pawn.isJumping=false;
        }
        
        if(keyboard.isDown(key.attack())) this.pawn.shoot(true);
        
        
    }
    draw(){
        // draw the mind
    }
    weapon(w){
        if(!w||w.constructor.name!="Weapon")return;
        this.pawn.weapon=w;
        PlayerController.data.weapon=w;
    }
}