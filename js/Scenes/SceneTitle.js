function SceneTitle(){
    
    this.title = new TextField("This is the Title", game.width()/2, 100, 30);
    
    this.menu = new Menu(25,25,100,32,[
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