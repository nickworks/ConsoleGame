function NPC(raw){
    this.seesPlayer=true;
    this.pawn=new Pawn(raw);
    this.pawn.a=600;
    this.canTalk=false;
    this.friend=raw.f;
    this.dialog=raw.d;
    this.serialize=function(){
        return{
            x:this.pawn.rect.x,
            y:this.pawn.rect.y,
            d:this.dialog,
            f:this.friend
        };
    };
    this.update=function(dt){
        if(this.friend){
            this.aiFriend(dt);
        } else {
            this.aiFoe(dt);
        }
    };
    this.aiFriend=function(dt){
        if(this.canTalk && keyboard.onDown([keycode.e,keycode.enter])){
            // do dialog
        }
    };
    this.aiFoe=function(dt){
        let move=0;
        
        if(this.seesPlayer){
            const p=scene.player.pawn.rect.mid();
            const me=this.pawn.rect.mid();
            this.pawn.dir=(me.x<p.x)?1:-1;
            if(me.x>p.x+200) move--;
            if(me.x<p.x-200) move++;
            
            if(me.y>p.y+25){//enemy is below player
                this.pawn.jump();
            } else if(me.y>p.y-25){
                this.pawn.shoot();
            }
        }
        
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    };
    
    this.draw=function(gfx){
        if(this.friend && this.canTalk){
            // TODO: use this.canTalk to show a "talk" icon
        }
        this.pawn.draw(gfx);  
    };
}