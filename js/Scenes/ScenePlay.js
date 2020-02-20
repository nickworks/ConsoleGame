class ScenePlay extends Scene {
    // n - what level to load
    // pos - where to spawn the player
    constructor(n, pos={x:0,y:0}){
        super();
        
        // spawn a HUD
        const hud = new HUD();

        // show the HUD by adding it to the modal stack:
        this.modal(hud);

        // attach the hud to the player's body
        hud.attach(this.player.pawn);

        this.levelIndex=n;
        const level=LevelData.level(this.levelIndex);

        this.objs.clear();
        LevelData.level(this.levelIndex).concat([this.player]).forEach(o => this.objs.add(o));
        
        this.ids(); // assign ID numbers to everything

        this.player.pawn.rect.x = pos.x;
        this.player.pawn.rect.y = pos.y;
    }
    update(dt){

        const res = super.update(dt);

        if(!res.sceneFrozen) {
            if(this.player && this.player.pawn.dead){
                this.modal(new Death());
            } else {
                if(mouse.onDown()) this.handleClick();
            }
        }
        if(!res.hasPause && keyboard.onDown(key.exit())) this.pause();
        
    }
    pause(){
        this.modal(new Pause());
    }
    draw(gfx){
        super.draw(gfx);
    }
    edit(){
        this.modal(new Editor());
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

        if(this.player.pawn.rect.mouseOver()) game.console.log("<dim>you clicked on</dim> player");

        const o = this.objs.getUnderMouse();
        if(o){
            const index = this.objs.indexOf(o);
            const oid = o.oid;
            game.console.log("<dim>you clicked on object <val>"+index+"</val>. You can access it by typing </dim>obj(<val>"+index+"</val>)");
        }


    }
    ids(){ // assign ids to non-id'd objects
        this.objs.all.forEach(o=>{
            if(!o.oid)o.oid = this.id();
        });
    }
    obj(id){ // fetch objects by id
        var res=null;
        this.objs.all.forEach(i=>{if(i.oid==id)res=i;});
        return res;
    }
    id(){ // get new, unused id number
        let i=0;
        this.objs.all.forEach(o=>{
            const n=o.oid|0;
            if(n>i)i=n;
        });
        return i+1;
    }
}