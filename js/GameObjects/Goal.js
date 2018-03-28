function Goal(raw={}){
    var rect=new Rect(raw.x||0,raw.y||0,50,100);
    this.update=function(){
        
    };
    this.serialize=function(){
        return {
            x:rect.x,
            y:rect.y
        };
    }
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        rect.draw(gfx);
    };
}