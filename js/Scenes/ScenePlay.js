function ScenePlay(n){
    this.levelIndex=n;
    this.cam=new Camera();
    this.player=null;
    this.goal=new Goal(Rect.from({x:200,y:200,w:50,h:100}));
    this.platforms=[];
    this.npcs=[];
    this.doors=[];
    this.bullets=[];
    this.modal=null;
    
    
    this.update = function(dt){
        if(this.player==null)this.load();
        else if(this.modal){
            const newScene=this.modal.update(dt);
            if(newScene)return newScene;
            if(this.modal.reloadLevel)return new ScenePlay(this.levelIndex);
            if(this.modal.remove)this.modal=null;
        } else {
            if(mouse.onDown()) this.handleClick();
            if(this.player)this.player.update(dt);
            this.platforms.forEach(p=>{
                p.update(dt);
                p.rect.fixOverlaps(this.player);
                p.rect.fixOverlaps(this.npcs);
            });
            for(var i in this.npcs){
                const n=this.npcs[i];
                const overlaps=n.pawn.rect.overlaps(this.player.pawn.rect);
                n.update(dt, overlaps);
                if(n.dead)this.npcs.splice(i,1);
            }
            this.doors.forEach(d=>{
                d.update(dt);
                //this.player.pawn.fixOverlap(d.rect);
                d.rect.fixOverlaps(this.player);
                d.rect.fixOverlaps(this.npcs);
            });
            
            for(var i in this.bullets){
                const b=this.bullets[i];
                b.update(dt);
                const hit=(o)=>{
                    if(o.friend===b.friend)return;
                    b.dead=true;
                    if(o.hurt)o.hurt(b.dmg);
                };
                b.rect.groupCheck([this.player], hit);
                b.rect.groupCheck(this.npcs, hit);
                b.rect.groupCheck(this.doors, hit);
                b.rect.groupCheck(this.platforms, hit);
                if(b.dead)this.bullets.splice(i,1);
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
        this.goal.draw(gfx);
        this.cam.drawEnd(gfx);
        if(this.modal)this.modal.draw(gfx);
    };
    this.load=function(levelIndex){
        const level=LevelData.level(levelIndex||this.levelIndex);
        
        this.player=level.player;
        this.platforms=level.platforms;
        this.npcs=level.npcs;
        this.doors=level.doors;
        
        this.modal=null;
        this.bullets=[];
        this.cam.target=this.player.pawn;
    };
    this.edit=function(){
        this.modal=new Editor();
    };
    this.handleClick=function(){
        const pre="you clicked on scene.";
        if(this.player.pawn.rect.mouseOver()) this.log(pre+"player");
        const check=(a,str)=>{
            for(var i in a){
                const rect=a[i].rect||a[i].pawn.rect;
                if(rect.mouseOver())this.log(pre+str+"["+i+"]");
            }
        };
        check(this.bullets, "bullets");
        check(this.platforms, "platforms");
        check(this.doors, "doors");
        check(this.npcs, "npcs");
    };
    this.log=function(msg){
        console.log(msg);
        consoleObj.log(msg);
    };
    this.obj=function(id){
        const all=[this.player].concat(this.platforms,this.npcs,this.doors);
        const res=[];
        all.forEach(i=>{if(i.id==id)res.push(i);});
        return res;
    };
    this.call=function(c){
        c.forEach(d=>{
            var o=this.obj(d.i); // fetch object by id
            o.forEach(obj=>{
                obj.this=obj;
                console.log(obj);
                console.log(d.f);
                if(obj[d.f])obj[d.f]();
            });
        });
    };
}
