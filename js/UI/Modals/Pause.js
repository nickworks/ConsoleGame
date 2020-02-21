class Pause extends Modal {
    constructor(){
        super();
        this.isPause = true;
        const options=[{
            caption:"Resume",
            callback:()=>{ game.scene.unpause(); }
        },{
            caption:"Reset Level",
            callback:()=>{ game.scene.startLevel(); game.scene.unpause(); }
        }];
        if(game.settings.editModeEnabled)options.push({
            caption:"Editor",
            callback:()=>{ scene.guis.editor = new Editor(); game.scene.unpause(); }
        });
        options.push({
            caption:"Quit",
            callback:()=>{ game.switchScene(new SceneTitle()); }
        });
        this.menu=new Menu(0,100,game.width(),32,options);
    }
    update(){
        this.menu.update();
        if(keyboard.onDown(key.exit())) game.scene.unpause();
    }
    draw(gfx){
        gfx.fillStyle="rgba(0,0,0,.75)";
        gfx.fillRect(0,0,game.width(),game.height());
        this.menu.draw(gfx);
    }
}