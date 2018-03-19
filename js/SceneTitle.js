function SceneTitle(){
    
    this.title = new TextField("This is the Title", game.width/2, 100, 30);
    //this.tag = new TextField("Press [ENTER] to play!", game.width/2, 150, 14);
    
    this.dlg = new Dialog();
    this.dlg.display(game.gfx, "Hello world! This is a long string of text. It should wrap.");
    this.menu = new Menu(25,25,100,32,[
        {caption:"Play",callback:()=>{this.switchToPlay=true;}},
        {caption:"Tutorial",callback:()=>{}},
        {caption:"About",callback:()=>{}}
    ]);
    
    this.update = function(dt){
        this.menu.update(dt);
        this.dlg.update(dt);
        if(this.switchToPlay){
            return new ScenePlay();
        }
    };
    this.draw = function(gfx){
        game.clear();
        this.title.draw(gfx);
        this.menu.draw(gfx);
        this.dlg.draw(gfx);
    };
}