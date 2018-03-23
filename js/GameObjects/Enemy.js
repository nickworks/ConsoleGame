function Enemy(x,y){
    this.seesPlayer=true;
    this.pawn=new Pawn(x,y);
    this.update=function(dt){
        
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
        this.pawn.draw(gfx);  
    };
    this.pawn.a=600;
}