function Pause(){
    this.menu=new Menu(25,25,100,32,[{
        caption:"Resume",
        callback:()=>{this.remove=true;}
    },{
        caption:"Quit",
        callback:()=>{this.backToMainMenu=true;}
    }]);
    this.update=function(dt){
        this.menu.update(dt);
        if(this.backToMainMenu)return new SceneTitle();
    };
    this.draw=function(gfx){
        gfx.fillStyle="rgba(0,0,0,.75)";
        gfx.fillRect(0,0,game.width,game.height);
        this.menu.draw(gfx);
    };
}