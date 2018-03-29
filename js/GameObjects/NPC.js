function NPC(raw={}){
    this.id=raw.i||0;
    this.agro=false;
    this.pawn=new Pawn(raw);
    this.pawn.a=raw.a||800;
    this.canTalk=false;
    this.friend=(!!raw.f);
    this.dialog=raw.d||[];
    this.hp=100;
    this.dead=false;
    this.patrolStart=this.pawn.rect.mid().x;
    this.patrolDis=100;
    this.patrolTimer=0;
    
    this.callbacks={
        onSpeak:(raw.onSpeak||[]),
        onDeath:(raw.onDeath||[])
    };
    
    this.jump=function(){
      //this is testing the event system
        console.log("JUMP");
        this.hurt(500);
    };
    this.serialize=function(){
        var data={
            x:this.pawn.rect.x,
            y:this.pawn.rect.y,
            d:this.dialog,
            f:this.friend,
            a:this.pawn.a
        };
        var a=this.callbacks.onSpeak;
        var b=this.callbacks.onDeath;
        if(a&&a.length>0)data.onSpeak=a;
        if(b&&b.length>0)data.onDeath=b;
        return data;
    };
    this.update=function(dt){
        this.canTalk=this.pawn.rect.overlaps(scene.player.pawn.rect);
        
        if(this.friend){
            this.aiFriend(dt);
        } else {
            this.aiFoe(dt);
        }
    };
    this.aiFriend=function(dt){
        if(this.canTalk && keyboard.onDown([keycode.e,keycode.enter])){
            this.speak();
        }
    };
    this.aiFoe=function(dt){
        let move=0;
        if(this.agro){
            const p=scene.player.pawn.rect.mid();
            const me=this.pawn.rect.mid();
            this.pawn.dir=(me.x<p.x)?1:-1;
            if(me.x>p.x+200) move--;
            if(me.x<p.x-200) move++;
            
            if(me.y>p.y+25){//enemy is below player
                this.pawn.jump();
            } else if(me.y>p.y-25){
                this.pawn.shoot(false);
            }
        } else {
            
            move=this.patrol(dt);
            
            if(this.pawn.canSee(scene.player.pawn.rect))this.agro=true;
        }
        this.pawn.agro=this.agro;
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    };
    this.patrol=function(dt){
        let move=0;
        const target=this.patrolStart+this.patrolDis*this.pawn.dir;
        if(this.pawn.dir<0){
            if(target<this.pawn.rect.x){
                move=-1;
                this.patrolTimer=1;
            }else{
                this.patrolTimer-=dt;
                if(this.patrolTimer<=0){
                    this.pawn.dir*=-1;
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
                    this.pawn.dir*=-1;
                }
            }
        }
        return move;
    };
    this.speak=function(){
        const p=this.pawn.rect.mid();
        scene.modal=new Dialog(p.x,p.y-13,this.dialog,this.callbacks.onSpeak);
    };
    this.draw=function(gfx){
        gfx.fillStyle=this.friend?"#6A3":"#F43";
        this.pawn.draw(gfx);
        if(this.friend&&this.canTalk&&!scene.modal){
            const p=this.pawn.rect.mid();
            gfx.beginPath();
            gfx.ellipse(p.x,p.y-25,10,10,0,0,Math.PI*2,false);
            gfx.closePath();
            gfx.fillStyle="#999";
            gfx.fill();
        }
    };
    this.hurt=function(amt){
        this.hp-=amt;
        if(this.hp<=0){
            if(this.dead==false)scene.call(this.callbacks.onDeath);
            this.dead=true;
        }
    };
    this.seeFar=function(amt=300){
        this.pawn.sightRange=amt;
    };
}