class PlayerController extends Controller {

    static data={
        weapon:null,
        coins:0,
        quests:[],
        reset(){
            this.weapon=null;
            this.coins=0;
            this.quests=[];
            game.console.log("<dim>player data reset</dim>");
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
        
        this.pawn=new Pawn(raw);
        this.pawn.mind=this;
        this.pawn.jumpCooldownAmt=0;
        this.friend=true;
        this.isPlayer=true;

        this.weaponAccuracy=.8;
        this.canDoubleJump=false;
        this.canWallJump=()=>{return false;};

        
        if(Game.DEVMODE){
            Weapon.types.forEach( w=>this.weapon(new w()) );
        } else {
            this.weapon(new Weapon({t:Weapon.Type.WEAK}));
        }
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

        if(keyboard.onDown(key.jump())) this.pawn.jump();
        if(keyboard.onDown(key.reload()) && this.pawn.weapon()) this.pawn.weapon().reload();

        this.wantsToMove=move;
        this.wantsToCrouch=keyboard.isDown(key.crouch());
        this.wantsToJump=keyboard.isDown(key.jump());
        this.wantsToDash=keyboard.isDown(key.dash());
        this.wantsToShoot=(mouse.onDown()||keyboard.isDown(key.attack())||(this.wantsToShoot && mouse.isDown()));
        if(this.wantsToShoot)this.pawn.shoot();
        else this.pawn.noShoot();
        
        this.wantsToAim = mouse.isDownRight();
        game.time.scale = this.wantsToAim?.5:1;

        this.pawn.aimAtMouse();
    }
    draw(){
        // draw the mind
    }
    weapon(w){
        if(w&&w instanceof Weapon){
            this.pawn.pickupWeapon(w);
            PlayerController.data.weapon=w;
        }
    }
}