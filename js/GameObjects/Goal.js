function Goal(x,y){
    var rect=new Rect(x,y,50,100);
    this.update=function(){
        
    };
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        rect.draw(gfx);
    };
}