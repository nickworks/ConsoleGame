function SceneTitle(){
    
    this.title = new TextField("This is the Title", game.width/2, 100, 30);
    this.tag = new TextField("Press [ENTER] to play!", game.width/2, 150, 14);
    
    this.update = function(dt){
        if(keyboard.onDown(keycode.enter)){
            return new ScenePlay();
        }
    };
    this.draw = function(gfx){
        game.clear();
        this.title.draw(gfx);
        this.tag.draw(gfx);
    };
}