function Player(x,y){
    this.pawn=new Pawn(x,y);
    
    this.update=function(dt){
        
        let move=0;
        let slowDown=false;
        if(keyboard.isDown([keycode.a,keycode.left]))move--;
        if(keyboard.isDown([keycode.d,keycode.right]))move++;

        const jumpKeys=[keycode.w,keycode.up];
        if(keyboard.onDown(jumpKeys)){
            if(this.pawn.isGrounded)this.pawn.jump(false);
            else if(this.pawn.airJumpsLeft>0)this.pawn.jump(true);
        }
        if(!keyboard.isDown(jumpKeys)){
            this.pawn.isJumping=false;
        }
        
        if(keyboard.isDown(keycode.space)) this.pawn.shoot();
        
        this.pawn.moveV(dt);
        this.pawn.moveH(dt,move);
        this.pawn.update(dt);
    };
    this.draw=function(gfx){
        this.pawn.draw(gfx);
    };
}


