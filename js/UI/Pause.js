function Pause(){
    const options=[{
        caption:"Resume",
        callback:()=>{this.remove=true;}
    },{
        caption:"Reset Level",
        callback:()=>{this.reloadLevel=true;}
    }];
    if(game.settings.editModeEnabled)options.push({
        caption:"Editor",
        callback:()=>{
            this.launchEditor=true;
        }
    });
    options.push({
        caption:"Quit",
        callback:()=>{this.backToMainMenu=true;}
    });
    this.menu=new Menu(0,100,game.width(),32,options);
    this.update=function(dt){
        this.menu.update(dt);
        if(keyboard.onDown(keycode.escape))this.remove=true;
        if(this.backToMainMenu)return new SceneTitle();
        if(this.launchEditor)scene.modal=new Editor();
    };
    this.draw=function(gfx){
        gfx.fillStyle="rgba(0,0,0,.75)";
        gfx.fillRect(0,0,game.width(),game.height());
        this.menu.draw(gfx);
    };
}