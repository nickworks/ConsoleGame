function SceneTitle(){
    
    this.title = new TextField("This is the Title", 20, 50, {size:30});
    
    this.menu = new Menu(0,100,game.width(),32,[
        {caption:"Play",callback:()=>{this.switchToPlay=true;}},
        {caption:"Tutorial",callback:()=>{}},
        {caption:"About",callback:()=>{}}
    ]);
    
    this.update = function(dt){
        this.menu.update(dt);
        if(this.switchToPlay){
            return new ScenePlay(0);
        }
    };
    this.draw = function(gfx){
        game.clear();
        this.title.draw(gfx);
        this.menu.draw(gfx);
    };
}