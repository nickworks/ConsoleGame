class SceneTitle {
    constructor(){
        this.title=new TextField("open source", 20, 50, {size:30,color:"#9AF"});
        this.menu = new Menu(0,100,game.width(),32,[
            {caption:"Play",callback:()=>{this.fadeToScene=new SceneLoad(new ScenePlay(0));}},
            {caption:"Tutorial",callback:()=>{game.console.log("// Tutorial coming soon!")}},
            {caption:"About",callback:()=>{
                game.console.log("/*\n * Open Source v0.3\n * A game by Nick Pattison\n * Write code to change the game!\n * Contribute to it here: https://github.com/nickworks/ConsoleGame\n */");
            }}
        ]);
        PlayerController.data={};
    }
    update(dt){
        this.menu.update(dt);
        return this.fadeToScene;
    }
    draw(gfx){
        game.view.clear("#555");
        this.title.draw(gfx);
        this.menu.draw(gfx);
    }    
    
}