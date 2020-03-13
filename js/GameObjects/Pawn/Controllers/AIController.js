class AIController extends Controller {
    constructor(raw={}){
        super();
        this.oid=raw.i||0;
        this.agro=false;
        this.pawn=new Pawn(raw);
        this.pawn.mind=this;
        this.pawn.a=raw.a||400;
        this.canTalk=false;
        this.friend=(!!raw.f);
        this.dialog=raw.d||[];
        this.patrolStart=this.pawn.rect.mid().x;
        this.patrolDis=100;
        this.patrolTimer=0;

        this.weaponAccuracy=.5;
        
        this.hint=new BubbleHint("TALK");
        this.callbacks={
            onSpeak:Callback.from(raw.onSpeak),
            onDeath:Callback.from(raw.onDeath),
            onData:Callback.from(raw.onData),
        };
    }
    serialize(){
        var data={
            i:this.oid,
            x:this.pawn.rect.x|0,
            y:this.pawn.rect.y|0,
            d:this.dialog,
            f:this.friend,
            a:this.pawn.a,
        };
        var a=Callback.serialize(this.callbacks.onSpeak);
        var b=Callback.serialize(this.callbacks.onDeath);
        var c=Callback.serialize(this.callbacks.onData);
        if(a&&a.length>0)data.onSpeak=a;
        if(b&&b.length>0)data.onDeath=b;
        if(c&&c.length>0)data.onData=c;
        if(this.pawn.sightRange!=300)data.s=this.pawn.sightRange;
        return data;
    }
    id(i){
        if(i)this.oid=i;
        return this.oid;  
    }
    update(){
        this.canTalk=this.pawn.rect.overlaps(scene.player.pawn.rect);
        if(this.friend){
            this.aiFriend();
        } else {
            this.aiFoe();
        }
        //this.pawn.dir=this.wantsToMove;
    }
    aiFriend(){
        if(this.canTalk && keyboard.onDown(key.activate())){
            this.speak();
        }
    }
    aiAlly(){

    }
    aiFoe(){
        let move=0;
        if(this.agro){
            const p=scene.player.pawn.rect.mid();
            const me=this.pawn.rect.mid();
            this.pawn.dir=(me.x<p.x)?1:-1;
            if(me.x>p.x+200) move--;
            if(me.x<p.x-200) move++;

            this.wantsToJump=false;
            this.pawn.aimAt(player.pawn);
            if(me.y-50>p.y){//enemy is below player

                this.wantsToJump=true;
                this.pawn.jump();
            } else if(me.y+50<p.y){
                this.pawn.drop();
            } else {
                this.pawn.shoot();
            }
        } else {
            
            move=this.patrol();
            
            if(this.pawn.canSee(scene.player.pawn.rect))this.agro=true;
        }
        this.wantsToMove=move;
    }
    notify(){
        this.agro=true;
    }
    patrol(){
        let move=0;
        const target=this.patrolStart+this.patrolDis*this.pawn.dir;
        if(this.pawn.dir<0){
            if(target<this.pawn.rect.x){
                move=-1;
                this.patrolTimer=1;
            }else{
                this.patrolTimer-=game.time.dt;
                if(this.patrolTimer<=0){
                    this.pawn.dir=1;
                }
            }
        }
        if(this.pawn.dir>0){
            if(target>this.pawn.rect.x){
                move=1;
                this.patrolTimer=1;
            }else{
                this.patrolTimer-=game.time.dt;
                if(this.patrolTimer<=0){
                    this.pawn.dir=-1;
                }
            }
        }
        return move;
    }
    speak(){
        const p=this.pawn.rect.mid();
        scene.modal(new Dialog(p.x,p.y-13,this.dialog,this.callbacks));
        this.canTalk = false;
    }
    draw(){

        if(this.friend&&this.canTalk){
            this.hint.x=this.pawn.rect.mid().x;
            this.hint.y=this.pawn.rect.y;
            this.hint.draw();
        }
    }
    changeType(){
        this.friend=!this.friend;  
    }
    setSight(p){
        const s=p?(p.amt?p.amt:p):300;
        this.pawn.sightRange=s;
    }
}