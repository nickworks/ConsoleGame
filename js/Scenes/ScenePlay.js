class ScenePlay extends Scene {


    // this creates a scene from deserialized data.
    // but it fails for serialized data...  :/
    fromData(data,pos={x:0,y:0}){

        if(!pos)pos={x:0,y:0};
        this.player.pawn.rect.x = pos.x;
        this.player.pawn.rect.y = pos.y;
        this.cam.updateGoals(this.player.pawn);
        this.cam.cut();

        this.objs.clear();
        data.concat([this.player.pawn]).forEach(o => this.objs.add(o));        
        this.ids(); // assign ID numbers to everything
        game.time.scale=1;
    }
    fromLevel(n,pos={x:0,y:0}){
        const data=LevelData.level(n);
        this.reloadScene = ()=>game.switchScene(SceneLoad.Level(n, pos));
        this.fromData(data,pos);
        return this;
    }

    // n - what level to load
    // pos - where to spawn the player
    constructor(){
        super();
        
        const hud = new HUD();          // spawn a HUD
        this.guis.overlays.push(hud);     // add the HUD to the gui stack
        hud.attach(this.player.pawn);   // attach the hud to the player's body
        
    }
    update(){


        const isPaused = super.update();
        if(isPaused) return;

        if(this.player && this.player.pawn.dead){
            scene.guis.death = new Death();
        } else {
            if(mouse.onDown()) this.shootAtMouse();
            if(mouse.onDownRight()) this.scanAtMouse();
        }
        
        if(keyboard.onDown(key.exit())) this.pause();
        
    }
    draw(){
        super.draw();
    }
    edit(){
        this.guis.editor = new Editor();
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

        let d = r/2;
        let a = 0;
        const num=6;
        for(let i = 0; i < num; i++){
            const xx = d*Math.cos(a);
            const yy = d*Math.sin(a);
            this.addParticles(x+xx,y+yy,Particle.Type.BOOM,8);
            a+=2*Math.PI/num;
        }
        this.cam.shake=.5;
        
        this.objs.damageable.forEach(o=>{
            const res = o.rect.overlapsCircle(x,y,r);
            if(res&&res.p>0&&o.hurt) o.hurt(dmg*res.p);
        });

        this.pulse(x,y,r,dmg*10);
        sfx.play("explosion");
    }
    pulse(x,y,radius,force=0){

        let n=0;

        this.objs.physics.forEach(o=>{
            
            const res = o.rect.overlapsCircle(x,y,radius);
            if(!res) return;

            n++;
            //console.log("WAKE "+o.constructor.name);
            o.phys.isAsleep=false;

            if(!force)return;

            let mag=force*res.p;
            let vx=mag*res.dir.x;
            let vy=mag*res.dir.y;
            if(vy>0)vy*=-1; // always launch up

            o.phys.impulse({
                x:vx+Math.random()*200-100,
                y:vy+Math.random()*200
            });
        });
    }
    shootAtMouse(){

    }
    scanAtMouse(){

        if(this.player.pawn.rect.mouseOver()) {
            game.console.log("<dim>You clicked on <val>player</val>. You can access it by typing</dim> player");
            return;
        }

        // get the object under the mouse:
        const o = this.objs.getUnderMouse();
        if(o){ // if it exists:
            const index = this.objs.indexOf(o); // get its index number
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