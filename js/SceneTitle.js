function SceneTitle(){
    
    this.title = new TextField("This is the Title", game.width/2, 100, 30);
    //this.tag = new TextField("Press [ENTER] to play!", game.width/2, 150, 14);
    //this.bttn = new Button("testing...", ()=>{this.switchToPlay=true;}, 25, 25, 100, 32);
    this.menu = new Menu(25,25,100,32,[
        {caption:"Play",callback:()=>{this.switchToPlay=true;}},
        {caption:"Test 2",callback:()=>{}},
        {caption:"Test 3",callback:()=>{}}
    ]);
    
    this.update = function(dt){
        //this.bttn.update(dt);
        this.menu.update(dt);
        if(this.switchToPlay){
            return new ScenePlay();
        }
    };
    this.draw = function(gfx){
        game.clear();
        this.title.draw(gfx);
        //this.tag.draw(gfx);
        this.menu.draw(gfx);
    };
}