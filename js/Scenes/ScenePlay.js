function ScenePlay(n){
    this.cam=new Camera();
    this.player=null;
    this.platforms=[];
    this.npcs=[];
    this.doors=[];
    this.bullets=[];
    this.modal=null;
    this.update = function(dt){
        if(this.modal){
            const newScene=this.modal.update(dt);
            if(newScene)return newScene;
            if(this.modal.reloadLevel)return new ScenePlay(this.levelIndex);
            if(this.modal.remove)this.modal=null;
        } else {
            if(mouse.onDown()) this.handleClick();
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
            for(var i in this.bullets){
                const b=this.bullets[i];
                b.update(dt);
                const die=(o)=>{this.bullets.splice(i,1);};
                b.rect.groupCheck(this.npcs, die);
                b.rect.groupCheck(this.doors, die);
                b.rect.groupCheck(this.platforms, die);
            }
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
        this.bullets.forEach(b=>b.draw(gfx));
        this.cam.drawEnd(gfx);
        if(this.modal)this.modal.draw(gfx);
    };
    this.load=function(levelIndex){
        
        this.levelIndex=levelIndex;
        const level=new Level1();
        
        this.modal=null;
        this.player=level.player;
        this.platforms=level.platforms;
        this.npcs=level.npcs;
        this.doors=level.doors;
        this.bullets=[];
    };
    this.edit=function(){
        this.modal=new Editor();
    };
    this.handleClick=function(){
        const pre="you clicked on scene.";
        if(this.player.rect.mouseOver()) this.log(pre+"player");
        for(var i in this.bullets) if(this.bullets[i].rect.mouseOver()) this.log(pre+"bullets["+i+"]");
        for(var i in this.platforms) if(this.platforms[i].rect.mouseOver()) this.log(pre+"platforms["+i+"]");
        for(var i in this.doors) if(this.doors[i].rect.mouseOver()) this.log(pre+"doors["+i+"]");
        for(var i in this.npcs) if(this.npcs[i].rect.mouseOver()) this.log(pre+"npcs["+i+"]");
    };
    this.log=function(msg){
        console.log(msg);
        consoleObj.log(msg);
    }
    this.load(n);
    
}