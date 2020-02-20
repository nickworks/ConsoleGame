class SceneTitle {
    constructor(){
        this.title=new TextField("open source", 20, 50, {size:30,color:"#9AF"});
        this.menu = new Menu(0,100,game.width(),32,[
            {caption:"Play",callback:()=>{game.switchScene(SceneLoad.Level(0, {x:-1250, y:230}));}},
            {caption:"Tutorial",callback:()=>{game.console.log("// Tutorial coming soon!")}},
            {caption:"About",callback:()=>{
                game.console.log("/*\n * Open Source v0.3\n * A game by Nick Pattison\n * Write code to change the game!\n * Contribute to it here: https://github.com/nickworks/ConsoleGame\n */");
            }}
        ]);
        PlayerController.data={};
    }
    update(dt){
        this.menu.update(dt);
    }
    draw(gfx){
        game.view.fill("#555");
        this.title.draw(gfx);
        this.menu.draw(gfx);
    }    
    
}