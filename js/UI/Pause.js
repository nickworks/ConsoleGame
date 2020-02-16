class Pause {
    constructor(){
        const options=[{
            caption:"Resume",
            callback:()=>{this.remove=true;}
        },{
            caption:"Reset Level",
            callback:()=>{ game.switchScene(new ScenePlay(game.scene.levelIndex)); }
        }];
        if(game.settings.editModeEnabled)options.push({
            caption:"Editor",
            callback:()=>{
                this.launchEditor=true;
            }
        });
        options.push({
            caption:"Quit",
            callback:()=>{ game.switchScene(new SceneTitle()); }
        });
        this.menu=new Menu(0,100,game.width(),32,options);
    }
    update(dt){
        this.menu.update(dt);
        if(keyboard.onDown(key.exit()))this.remove=true;

        if(this.launchEditor) scene.modal=new Editor(); // this should replace the Pause modal with the Editor modal
    }
    draw(gfx){
        gfx.fillStyle="rgba(0,0,0,.75)";
        gfx.fillRect(0,0,game.width(),game.height());
        this.menu.draw(gfx);
    }
}