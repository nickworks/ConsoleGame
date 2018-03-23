function Enemy(x,y){
    this.rect=new Rect(x,y,25,25);
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);  
    };
}