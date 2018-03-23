function Enemy(x,y){
    this.seesPlayer=true;
    this.pawn=new Pawn(x,y);
    this.update=function(dt){
        
        let move=0;
        
        if(this.seesPlayer){
            const p=scene.player.pawn.rect.mid();
            const me=this.pawn.rect.mid();
            if(me.x>p.x+200) move--;
            if(me.x<p.x-200) move++;
            
            this.pawn.shoot();
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