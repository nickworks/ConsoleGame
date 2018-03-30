function ScenePlay(n){
    var levelIndex=n;//private
    var cam=new Camera();
    var player=null;
    var goal=null;
    var platforms=[];
    var npcs=[];
    var doors=[];
    var bullets=[];
    var items=[];
    var hud=new HUD();
    
    this.modal=null;
    
    var alphaOverlay=1;
    var fadeToScene=null;
    
    this.update=function(dt){
        if(fadeToScene){
            if(alphaOverlay<1)alphaOverlay+=dt*2;
            else return fadeToScene;
        } else if(alphaOverlay>0)alphaOverlay-=dt*2;
        
        this.cam=cam;
        this.player=player;
        this.platforms=platforms;
        this.npcs=npcs;
        this.doors=doors;
        this.bullets=bullets;
        this.items=items;
        
        if(player==null)return;
        else if(this.modal){
            const newScene=this.modal.update(dt);
            if(newScene&&!fadeToScene)fadeToScene=newScene;
            else if(this.modal.reloadLevel&&!fadeToScene)fadeToScene=new ScenePlay(levelIndex);
            else if(this.modal.remove)this.modal=null;
            else if(mouse.onDown()) this.handleClick();
        } else {
            if(mouse.onDown()) this.handleClick();
            if(player)player.update(dt);
            for(var i in items){
                items[i].update(dt);
                if(items[i].rect.overlaps(player.pawn.rect))items[i].activate();
                if(items[i].dead)items.splice(i,1);
            }
            for(var i in npcs){
                npcs[i].update(dt);
                if(npcs[i].dead)npcs.splice(i,1);
            }
            platforms.forEach(p=>{
                p.update(dt);
                p.block(player, dt);
                p.block(npcs, dt);
                p.block(items, dt);
            });
            doors.forEach(d=>{
                d.update(dt);
                d.block(player);
                d.block(npcs);
                d.block(items, dt);
            });
            
            if(goal&&goal.update(dt)&&!fadeToScene)fadeToScene=new SceneLoad(new ScenePlay(goal.nextLevel()));
            for(var i in bullets){
                const b=bullets[i];
                b.update(dt);
                const hit=(o)=>{
                    if(o.friend===b.friend)return;
                    b.dead=true;
                    if(o.hurt)o.hurt(b.dmg);
                };
                b.rect.groupCheck([player], hit);
                b.rect.groupCheck(npcs, hit);
                b.rect.groupCheck(doors, hit);
                b.rect.groupCheck(platforms, hit);
                if(b.dead)bullets.splice(i,1);
            }
            if(keyboard.onDown(key.exit())){
                this.pause();
            }
        }
        cam.update(dt);
        hud.update(dt);
    };
    this.pause=function(){
        if(this.modal==null)this.modal=new Pause();
    };
    this.unpause=function(){
        this.modal=null;  
    };
    this.draw=function(gfx){
        game.clear("#888");
        cam.drawStart(gfx);
        if(goal)goal.draw(gfx);
        platforms.forEach(p=>p.draw(gfx));
        player.draw(gfx);
        npcs.forEach(n=>n.draw(gfx));
        doors.forEach(d=>d.draw(gfx));
        bullets.forEach(b=>b.draw(gfx));
        items.forEach(i=>i.draw(gfx));
        cam.drawEnd(gfx);
        
        if(hud)hud.draw(gfx);
        if(this.modal)this.modal.draw(gfx);
        
        gfx.fillStyle="rgba(0,0,0,"+alphaOverlay+")";
        gfx.fillRect(0,0,game.width(),game.height());
        
    };
    this.edit=function(){
        this.modal=new Editor();
    };
    this.handleClick=function(){
        const pre="you clicked on scene.";
        if(player.pawn.rect.mouseOver()) this.log(pre+"player");
        const check=(a,str)=>{
            for(var i in a){
                const rect=a[i].rect||a[i].pawn.rect;
                if(rect.mouseOver())this.log(pre+str+"["+i+"] (object id #"+a[i].id()+")");
            }
        };
        check(bullets, "bullets");
        check(platforms, "platforms");
        check(doors, "doors");
        check(npcs, "npcs");
        check(items, "items");
    };
    this.setGoal=function(g){
        goal=g;
    };
    this.log=function(msg){
        console.log(msg);
        consoleObj.log(msg);
    };
    this.ids=function(){ // assign ids to non-id'd objects
        this.all().forEach(o=>{
            if(!o.id())o.id(this.id());
        });
    };
    this.all=function(){
        return [player].concat(npcs,doors,platforms,items);
    };
    this.obj=function(id){ // fetch objects by id
        var res=null;
        this.all().forEach(i=>{if(i.id()==id)res=i;});
        return res;
    };
    this.call=function(c){ // execute a callback
        c=c||[];
        var res=null;
        c.forEach(d=>{
            var o=this.obj(d.i); // fetch object by id
            if(o&&o[d.f])res=o[d.f]();
        });
        return res;
    };
    this.id=function(){ // get new, unused id number
        let i=0;
        this.all().forEach(o=>{
            const n=o.id()|0;
            if(n>i)i=n;
        });
        return i+1;
    };
    (()=>{ // load:
        const level=LevelData.level(levelIndex);
        player=level.player;
        goal=level.goal;
        platforms=level.platforms;
        npcs=level.npcs;
        doors=level.doors;
        items=level.items;
        this.modal=null;
        bullets=[];
        cam.target=player.pawn;
        cam.updateTargetXY(true);
        this.ids();
    })();
}