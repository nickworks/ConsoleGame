function Enemy(x,y){
    this.pawn=new Pawn(x,y);
    this.update=function(dt){
        
        let move=0;
        
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
    };
    this.draw=function(gfx){
        this.pawn.draw(gfx);  
    };
}