function NPC(raw){
    this.seesPlayer=true;
    this.pawn=new Pawn(raw);
    this.pawn.a=raw.a;
    this.canTalk=false;
    this.friend=raw.f;
    this.dialog=raw.d;
    this.hp=100;
    this.dead=false;
    this.serialize=function(){
        return{
            x:this.pawn.rect.x,
            y:this.pawn.rect.y,
            d:this.dialog,
            f:this.friend,
            a:this.pawn.a
        };
    };
    this.update=function(dt,overlaps){
        this.canTalk=overlaps;
        if(this.friend){
            this.aiFriend(dt);
        } else {
            this.aiFoe(dt);
        }
    };
    this.aiFriend=function(dt){
        if(this.canTalk && keyboard.onDown([keycode.e,keycode.enter])){
            // do dialog
            const p=this.pawn.rect.mid();
            scene.modal=new Dialog(p.x,p.y-50,this.dialog);
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
                this.pawn.shoot(false);
            }
        }
        
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    };
    this.draw=function(gfx){
        gfx.fillStyle=this.friend?"#6A3":"#F43";
        this.pawn.draw(gfx);
        if(this.friend && this.canTalk){
            const p=this.pawn.rect.mid();
            gfx.beginPath();
            gfx.ellipse(p.x,p.y-20,10,10,0,0,Math.PI*2,false);
            gfx.closePath();
            gfx.fillStyle="#999";
            gfx.fill();
        }
    };
    this.hurt=function(amt){
        this.hp-=amt;
        if(this.hp<=0)this.dead=true;
    }
}