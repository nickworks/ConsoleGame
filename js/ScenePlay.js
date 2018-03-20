function ScenePlay(n){
    this.cam=new Camera();
    this.player=null;
    this.platforms=[];
    this.npcs=[];
    this.doors=[];
    this.modal=null;
    this.update = function(dt){
        if(this.modal){
            const newScene=this.modal.update(dt);
            if(newScene)return newScene;
            if(this.modal.remove)this.modal=null;
            if(this.modal.reloadLevel)this.reload();
        } else {
            if(this.player)this.player.update(dt);
            this.platforms.forEach(p=>{
                p.update(dt);
                this.player.fixOverlap(p.rect);
            });
            this.npcs.forEach(n=>{
                const overlaps=n.rect.overlaps(this.player.rect);
                n.update(dt, overlaps);
            });
            this.doors.forEach(d=>{
                d.update(dt);
                this.player.fixOverlap(d.rect);
            });
            
            if(keyboard.onDown([keycode.p,keycode.escape])){
                this.modal=new Pause(this);
            }
            
        }
        this.cam.update(dt, this.player);
    };
    this.draw = function(gfx){
        game.clear();
        this.cam.drawStart(gfx);
        this.player.draw(gfx);
        this.npcs.forEach(n=>n.draw(gfx));
        this.platforms.forEach(p=>p.draw(gfx));
        this.doors.forEach(d=>d.draw(gfx));
        this.cam.drawEnd(gfx);
        if(this.modal)this.modal.draw(gfx);
    };
    this.load=function(levelIndex){
        this.modal=null;
        this.levelIndex=levelIndex;
        const level=levelData(levelIndex);
        this.player=level.player;
        this.platforms=level.platforms;
        this.npcs=level.npcs;
        this.doors=level.doors;
    };
    this.reload=function(){
        this.load(this.levelIndex);
    };
    this.load(n);
}