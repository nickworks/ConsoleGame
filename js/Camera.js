function Camera(){
    this.x=0;
    this.y=0;
    this.update=function(dt, target){
        if(target.rect){
            this.x=target.rect.x;
            this.y=target.rect.y;
        } else {
            this.x=target.x||this.x;
            this.y=target.y||this.y;
        }
    };
    this.drawStart=function(gfx){
        gfx.translate(game.width/2-this.x, game.height/2-this.y);
    };
    this.drawEnd=function(gfx){
        gfx.resetTransform();
    }
}