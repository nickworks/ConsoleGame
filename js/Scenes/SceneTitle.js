class SceneTitle {
    constructor(){
        this.alphaOverlay=1;
        this.fadeToScene=null;
        this.title=new TextField("open source", 20, 50, {size:30,color:"#9AF"});
        this.menu = new Menu(0,100,game.width(),32,[
            {caption:"Play",callback:()=>{this.fadeToScene=new SceneLoad(new ScenePlay(0));}},
            {caption:"Tutorial",callback:()=>{consoleObj.log("// Tutorial coming soon!")}},
            {caption:"About",callback:()=>{
                consoleObj.log("/*\n * Open Source v0.3\n * A game by Nick Pattison\n * Write code to change the game!\n * Contribute to it here: https://github.com/nickworks/ConsoleGame\n */");
            }}
        ]);
        Player.data={};
    }
    update(dt){
        if(this.fadeToScene){
            if(this.alphaOverlay<1)this.alphaOverlay+=dt*4;
            else return this.fadeToScene;
        } else if(this.alphaOverlay>0)this.alphaOverlay-=dt*2;
        this.menu.update(dt);
    }
    draw(gfx){
        game.clear("#555");
        this.title.draw(gfx);
        this.menu.draw(gfx);
        gfx.fillStyle="rgba(0,0,0,"+this.alphaOverlay+")";
        gfx.fillRect(0,0,game.width(),game.height());
    }    
    
}