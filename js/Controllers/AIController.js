class AIController extends Controller {
    constructor(raw={}){
        super();
        this.oid=raw.i||0;
        this.agro=false;
        this.pawn=new Pawn(raw);
        this.pawn.a=raw.a||400;
        this.canTalk=false;
        this.friend=(!!raw.f);
        this.dialog=raw.d||[];
        this.hp=raw.h||50;
        this.dead=false;
        this.patrolStart=this.pawn.rect.mid().x;
        this.patrolDis=100;
        this.patrolTimer=0;
        
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
            h:this.hp,
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
    update(dt){
        this.canTalk=this.pawn.rect.overlaps(scene.player.pawn.rect);
        
        if(this.friend){
            this.aiFriend(dt);
        } else {
            this.aiFoe(dt);
        }
    }
    aiFriend(dt){
        if(this.canTalk && keyboard.onDown(key.activate())){
            this.speak();
        }
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,0);
        this.pawn.update(dt);
    }
    aiFoe(dt){
        let move=0;
        if(this.agro){
            const p=scene.player.pawn.rect.mid();
            const me=this.pawn.rect.mid();
            this.pawn.dir=(me.x<p.x)?1:-1;
            if(me.x>p.x+200) move--;
            if(me.x<p.x-200) move++;
            
            if(me.y-50>p.y){//enemy is below player
                this.pawn.jump();
            } else if(me.y+50<p.y){
                this.pawn.drop();
            } else {
                this.pawn.shoot(false);
            }
        } else {
            
            move=this.patrol(dt);
            
            if(this.pawn.canSee(scene.player.pawn.rect))this.agro=true;
        }
        this.pawn.walking=!this.agro;
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    }
    patrol(dt){
        let move=0;
        const target=this.patrolStart+this.patrolDis*this.pawn.dir;
        if(this.pawn.dir<0){
            if(target<this.pawn.rect.x){
                move=-1;
                this.patrolTimer=1;
            }else{
                this.patrolTimer-=dt;
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
                this.patrolTimer-=dt;
                if(this.patrolTimer<=0){
                    this.pawn.dir=-1;
                }
            }
        }
        return move;
    }
    speak(){
        const p=this.pawn.rect.mid();
        scene.modal=new Dialog(p.x,p.y-13,this.dialog,this.callbacks);
    }
    draw(gfx){
        const imgL = this.friend ? sprites.playerL : sprites.enemyL;
        const imgR = this.friend ? sprites.playerR : sprites.enemyR;
        
        this.pawn.draw(gfx,imgL, imgR,{x:4,y:4});
        
        if(this.friend&&this.canTalk&&!scene.modal){
            this.hint.x=this.pawn.rect.mid().x;
            this.hint.y=this.pawn.rect.y;
            this.hint.draw(gfx);
        }
    }
    hurt(amt){
        this.agro=true;
        if(this.dead)return;
        this.hp-=amt;
        
        const r=this.pawn.rect;
        const raw={x:r.x,y:r.y};
        
        if(this.hp<=0){
            if(this.dead==false)Callback.do(this.callbacks.onDeath);
            this.dead=true;
            scene.spawnLoot(3,raw);
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