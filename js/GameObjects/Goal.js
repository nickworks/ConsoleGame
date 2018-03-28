function Goal(raw={}){
    var rect=new Rect(raw.x||0,raw.y||0,50,100);
    var next=raw.n||0;
    this.update=function(dt){
        return rect.overlaps(scene.player.pawn.rect);
    };
    this.serialize=function(){
        return {
            x:rect.x,
            y:rect.y,
            n:next
        };
    };
    this.draw=function(gfx){
        gfx.fillStyle="#39F";
        rect.draw(gfx);
    };
    this.nextLevel=function(){
        return next;  
    };
}