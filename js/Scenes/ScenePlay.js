class ScenePlay {
    constructor(n, pos){


        // load:
        (()=>{
            this.levelIndex=n;
            const level=LevelData.level(this.levelIndex);

            this.player=new PlayerController();
            this.hud=new HUD();
            this.hud.attach(this.player.pawn);
            
            this.objs={
                add(obj){
                    this.all.push(obj);
                    switch(obj.constructor.name){
                        case "Platform":
                        case "Crate":
                        case "Door":
                            this.blocking.push(obj);
                            break;
                        case "PlayerController":
                        case "AIController":
                            this.pawns.push(obj);
                            break;
                        case "PlayerController":
                        case "AIController":
                        case "Crate":
                            this.damageable.push(obj);
                            break;
                        case "Item":
                            this.physics.push(obj);
                            break;
                        case "Bullet":
                            this.bullets.push(obj);
                            break;
                    }
                },
                remove(obj){
                    this.removeFrom(obj, this.all);
                    this.removeFrom(obj, this.blocking);
                    this.removeFrom(obj, this.pawns);
                    this.removeFrom(obj, this.physics);
                    this.removeFrom(obj, this.bullets);
                    this.removeFrom(obj, this.damageable);
                },
                removeFrom(obj, arr){
                    const i = arr.indexOf(obj);
                    if(i != -1) arr.splice(i, 1); 
                },
                cleanup(){
                    for(let i=this.all.length-1; i>= 0; i--){
                        const obj = this.all[i];
                        if(obj.dead || (this.all[i].pawn && this.all[i].pawn.dead)) this.remove(obj);
                    }
                },
                all:[],
                blocking:[],
                pawns:[],
                physics:[],
                bullets:[],
                damageable:[],
            };

            const temp = [this.player].concat(level.goal,level.platforms,level.npcs,level.doors,level.items,level.crates);
            temp.forEach(o => this.objs.add(o));

            this.particles=[];
            this.modal=null;

            this.cam=new Camera();
            this.cam.target=this.player.pawn;
            this.cam.updateTargetXY(true);
            this.ids(); // assign ID numbers to everything

            
        })();

    }
    getObjsByType(){

    }
    update(dt){
        if(this.player==null)return;

        else if(this.modal){
            
            this.modal.update(dt);
            if(this.modal.remove)this.modal=null;

            else if(mouse.onDown()) this.handleClick();

        } else if(this.player.pawn.dead){

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

        // update all objects
        this.objs.all.forEach(o => o.update(dt));


        // do collision detection:
        this.objs.blocking.forEach(b=>{
            b.block(this.objs.pawns);
            b.block(this.objs.physics);
        });
        this.objs.bullets.forEach(b=>{
            b.overlap(this.objs.blocking);
            b.overlap(this.objs.pawns);
        });
        this.objs.physics.forEach(i=>{
            i.overlap(this.objs.pawns);
        });
        
        // remove all objects marked as "DEAD"
        this.objs.cleanup();
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
        this.objs.all.forEach(o => o.draw(gfx));
        this.particles.forEach(p => p.draw(gfx));
        this.cam.drawEnd(gfx);
        
        if(this.hud)this.hud.draw(gfx);
        if(this.modal)this.modal.draw(gfx);        
    }
    edit(){
        this.modal=new Editor();
    }
    spawnLoot(amt=1,raw={}){
        for(var i=0;i<amt;i++){
            this.objs.add(Item.random(raw))
        }
    }
    addParticles(x,y,t,n){
        for(var i=0;i<n;i++){
            this.particles.push(new Particle(x,y,t));
        };
    }
    explode(x,y,r=200,dmg=0){

        this.addParticles(x,y,1,8);
        this.cam.shake=.5;
        
        this.objs.damageable.forEach(o=>{
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
    ids(){ // assign ids to non-id'd objects
        this.all().forEach(o=>{
            if(!o.oid)o.oid = this.id();
        });
    }
    all(){
        return [this.player].concat(this.objs);
    }
    obj(id){ // fetch objects by id
        var res=null;
        this.all().forEach(i=>{if(i.oid==id)res=i;});
        return res;
    }
    id(){ // get new, unused id number
        let i=0;
        this.all().forEach(o=>{
            const n=o.oid|0;
            if(n>i)i=n;
        });
        return i+1;
    }
}