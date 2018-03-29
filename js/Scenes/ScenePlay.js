function ScenePlay(n){
    this.levelIndex=n;//private
    this.cam=new Camera();
    this.player=null;
    this.goal=null;
    this.platforms=[];
    this.npcs=[];
    this.doors=[];
    this.bullets=[];
    this.modal=null;
    var alphaOverlay=1;
    var fadeToScene=null;
    
    this.update=function(dt){       
        if(fadeToScene){
            if(alphaOverlay<1)alphaOverlay+=dt*2;
            else return fadeToScene;
        } else if(alphaOverlay>0)alphaOverlay-=dt*2;
        
        if(this.player==null)return;
        else if(this.modal){
            const newScene=this.modal.update(dt);
            if(newScene&&!fadeToScene)fadeToScene=newScene;
            else if(this.modal.reloadLevel&&!fadeToScene)fadeToScene=new ScenePlay(this.levelIndex);
            else if(this.modal.remove)this.modal=null;
            else if(mouse.onDown()) this.handleClick();
        } else {
            if(mouse.onDown()) this.handleClick();
            if(this.player)this.player.update(dt);
            for(var i in this.npcs){
                const n=this.npcs[i];
                const overlaps=n.pawn.rect.overlaps(this.player.pawn.rect);
                n.update(dt, overlaps);
                if(n.dead)this.npcs.splice(i,1);
            }
            this.platforms.forEach(p=>{
                p.update(dt);
                p.block(this.player, dt);
                p.block(this.npcs, dt);
            });
            this.doors.forEach(d=>{
                d.update(dt);
                d.block(this.player);
                d.block(this.npcs);
            });
            if(this.goal&&this.goal.update(dt)&&!fadeToScene)fadeToScene=new SceneLoad(new ScenePlay(this.goal.nextLevel()));
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
            if(keyboard.onDown(key.exit())){
                this.pause();
            }
        }
        this.cam.update(dt);
    };
    this.pause=function(){
        if(this.modal==null)this.modal=new Pause();
    };
    this.unpause=function(){
        this.modal=null;  
    };
    this.draw=function(gfx){
        game.clear("#888");
        this.cam.drawStart(gfx);
        if(this.goal)this.goal.draw(gfx);
        this.player.draw(gfx);
        this.npcs.forEach(n=>n.draw(gfx));
        this.platforms.forEach(p=>p.draw(gfx));
        this.doors.forEach(d=>d.draw(gfx));
        this.bullets.forEach(b=>b.draw(gfx));
        this.cam.drawEnd(gfx);
        
        if(this.modal)this.modal.draw(gfx);
        
        gfx.fillStyle="rgba(0,0,0,"+alphaOverlay+")";
        gfx.fillRect(0,0,game.width(),game.height());
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
                if(rect.mouseOver())this.log(pre+str+"["+i+"] (object id #"+a[i].id()+")");
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
    this.ids=function(){ // assign ids to non-id'd objects
        this.all().forEach(o=>{
            if(!o.id())o.id(this.id());
        });
    };
    this.all=function(){
        return [this.player].concat(this.npcs,this.doors,this.platforms);
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
            if(o[d.f])res=o[d.f]();
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
        const level=LevelData.level(this.levelIndex);
        this.player=level.player;
        this.goal=level.goal;
        this.platforms=level.platforms;
        this.npcs=level.npcs;
        this.doors=level.doors;
        this.modal=null;
        this.bullets=[];
        this.cam.target=this.player.pawn;
        this.cam.updateTargetXY(true);
        this.ids();
    })();
}