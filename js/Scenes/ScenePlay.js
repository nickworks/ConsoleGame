class ScenePlay {
    constructor(n){

        // these all used to be private:

        this.levelIndex=n;
        this.cam=new Camera();
        this.hud=new HUD();
        this.modal=null;
        this.fadeToScene=null;


        this.player=null;
        this.goal=null;
        this.platforms=[];
        this.npcs=[];
        this.doors=[];
        this.bullets=[];
        this.items=[];
        this.particles=[];
        this.crates=[];


        // load:
        (()=>{
            const level=LevelData.level(this.levelIndex);

            this.player=level.player;
            this.goal=level.goal;
            this.platforms=level.platforms;
            this.npcs=level.npcs;
            this.doors=level.doors;
            this.items=level.items;
            this.crates=level.crates;

            this.modal=null;
            this.bullets=[];
            this.cam.target=this.player.pawn;
            this.cam.updateTargetXY(true);
            this.ids();
        })();

    }
    
    update(dt){
        if(this.fadeToScene) return this.fadeToScene;
        if(this.player==null)return;

        else if(this.modal){
            
            const newScene=this.modal.update(dt);
            if(newScene&&!this.fadeToScene)this.fadeToScene=newScene;
            else if(this.modal.reloadLevel&&!this.fadeToScene)this.fadeToScene=new ScenePlay(this.levelIndex);
            else if(this.modal.remove)this.modal=null;
            else if(mouse.onDown()) this.handleClick();

        } else if(this.player.dead){

            this.modal=new Death();

        } else {
            if(mouse.onDown()) this.handleClick();

            this.updateGameObjects(dt);

            if(keyboard.onDown(key.exit())){
                this.pause();
            }
        }
        for(var i in this.particles){
            this.particles[i].update(dt);
            if(this.particles[i].dead)this.particles.splice(i,1);
        };
        this.cam.update(dt);
        this.hud.update(dt);
    }
    updateGameObjects(dt){
        if(this.player)this.player.update(dt);
        for(var i in this.items){
            this.items[i].update(dt);
            if(this.items[i].rect.overlaps(this.player.pawn.rect))this.items[i].pickup();
            if(this.items[i].dead)this.items.splice(i,1);
        }
        for(var i in this.npcs){
            this.npcs[i].update(dt);
            if(!this.npcs[i].friend&&this.npcs[i].pawn.rect.overlaps(this.player.pawn.rect)){
                const rightOfAIController=this.npcs[i].pawn.rect.mid().x<this.player.pawn.rect.mid().x;
                this.player.pawn.vx=rightOfAIController?300:-300;
                this.player.pawn.vy=-250;
            }
            if(this.npcs[i].dead)this.npcs.splice(i,1);
        }
        this.platforms.forEach(p=>{
            p.update(dt);
            p.block(this.player, dt);
            p.block(this.npcs, dt);
            p.block(this.items, dt);
        });
        this.doors.forEach(d=>{
            d.update(dt);
            d.block(this.player);
            d.block(this.npcs);
            d.block(this.items, dt);
        });
        for(var i in this.crates){
            const c=this.crates[i];
            c.block(this.player);
            c.block(this.npcs);
            c.block(this.items, dt);
            if(c.dead){
                if(c.hasLoot){
                    var amt=Math.random()+Math.random()+Math.random();
                    this.spawnLoot((amt*3)|0,c.rect.mid());
                }
                this.crates.splice(i,1);
            }
        }
        
        if(this.goal&&this.goal.update(dt)&&!this.fadeToScene)this.fadeToScene=new SceneLoad(new ScenePlay(this.goal.nextLevel()));
        for(var i in this.bullets){
            const b=this.bullets[i];
            b.update(dt);
            const check=(o)=>{
                if(b.rect.overlaps(o.rect||o.pawn.rect))b.hit(o);
            };
            
            check(this.player);
            this.npcs.forEach(check);
            this.doors.forEach(check);
            this.platforms.forEach(check);
            this.crates.forEach(check);
            
            if(b.dead)this.bullets.splice(i,1);
        }
    }
    pause(){
        if(this.modal==null)this.modal=new Pause();
    }
    unpause(){
        this.modal=null;  
    }
    draw(gfx){
        game.view.fill("#888");
        this.cam.drawStart(gfx);
        if(this.goal)this.goal.draw(gfx);
        this.doors.forEach(d=>d.draw(gfx));
        this.platforms.forEach(p=>p.draw(gfx));
        this.player.draw(gfx);
        this.npcs.forEach(n=>n.draw(gfx));
        this.bullets.forEach(b=>b.draw(gfx));
        this.items.forEach(i=>i.draw(gfx));
        this.particles.forEach(p=>p.draw(gfx));
        this.crates.forEach(c=>c.draw(gfx));
        this.cam.drawEnd(gfx);
        
        if(this.hud)this.hud.draw(gfx);
        if(this.modal)this.modal.draw(gfx);        
    }
    edit(){
        this.modal=new Editor();
    }
    spawnLoot(amt=1,raw={}){
        for(var i=0;i<amt;i++){
            this.items.push(Item.random(raw))
        }
    }
    addParticles(x,y,t,n){
        for(var i=0;i<n;i++){
            this.particles.push(new Particle(x,y,t));
        };
    }
    explode(x,y,r=200,dmg=0){
        const objs=[this.player].concat(this.items,this.npcs,this.crates);
        
        this.addParticles(x,y,1,8);
        this.cam.shake=.5;
        
        objs.forEach(o=>{
            const rect=o.rect||o.pawn.rect;
            const p=rect.mid();
            const dx=p.x-x;
            const dy=p.y-y;
            if(Math.abs(dx)<r&&Math.abs(dy)<r){
                const d=Math.sqrt(dx*dx+dy*dy);
                if(d<r){
                    let s=(r-d)/r;
                    if(o.hurt)o.hurt(dmg*s)
                    s*=400;
                    let vx=s*dx/d;
                    let vy=s*dy/d;
                    if(vy>0)vy*=-1;
                    vx+=Math.random()*200-100;
                    vy+=Math.random()*200;
                    if(o.isAsleep)o.isAsleep=false;
                    if(o.pawn){
                        o.pawn.vx=vx;
                        o.pawn.vy=vy;
                    }else{
                        o.vx=vx;
                        o.vy=vy;
                    }
                }
            }
        });
    }
    handleClick(){
        const pre="you clicked on scene.";
        if(this.player.pawn.rect.mouseOver()) game.console.log(pre+"player");
        const check=(a,str)=>{
            for(var i in a){
                const rect=a[i].rect||a[i].pawn.rect;
                if(rect.mouseOver())game.console.log(pre+str+"["+i+"] (object id #"+a[i].id()+")");
            }
        };
        check(this.bullets, "bullets");
        check(this.platforms, "platforms");
        check(this.doors, "doors");
        check(this.npcs, "npcs");
        check(this.items, "items");
    }
    goal(g){
        if(g)this.goal=g;
        return this.goal;
    }
    ids(){ // assign ids to non-id'd objects
        this.all().forEach(o=>{
            if(!o.id())o.id(this.id());
        });
    }
    all(){
        return [this.player].concat(this.npcs,this.doors,this.platforms,this.items);
    }
    obj(id){ // fetch objects by id
        var res=null;
        this.all().forEach(i=>{if(i.id()==id)res=i;});
        return res;
    }
    id(){ // get new, unused id number
        let i=0;
        this.all().forEach(o=>{
            const n=o.id()|0;
            if(n>i)i=n;
        });
        return i+1;
    }
}