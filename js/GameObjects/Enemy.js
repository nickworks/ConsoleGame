function Enemy(){
    this.rect=new Rect(100,0,25,25);
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);  
    };
}