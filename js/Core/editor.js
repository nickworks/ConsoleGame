class Editor {
    constructor(){
        scene.cam.target=null;
        this.snapSize=25;
        this.dragObj=null;
        this.dragOrig=null;//original position of obj
        this.dragStart=null;//original position of mouse
        this.dragModeSize=false;
    }
    snap(v){
        return Math.round(v/this.snapSize)*this.snapSize
    }
    update(dt){
        if(mouse.onDown()) this.handleClick();
        if(this.dragObj) this.handleDrag();
        if(keyboard.onDown(key.escape)){
            this.remove=true;
            scene.cam.target=scene.player.pawn;
        }
        if(keyboard.onDown(key.enter)){
            this.serialize();
        }
        if(keyboard.onDown(key.n)){
            var s = new ScenePlay();
            s.modal=this;
            s.cam.target=null;
            return s;
        }
        this.moveCam(dt);
    }
    moveCam(dt){
        const c=scene.cam;
        const s=300;
        if(keyboard.isDown(key.w)) c.ty-=s*dt;
        if(keyboard.isDown(key.a)) c.tx-=s*dt;
        if(keyboard.isDown(key.s)) c.ty+=s*dt;
        if(keyboard.isDown(key.d)) c.tx+=s*dt;
    }
    handleClick(){
        
        const m=scene.cam.worldMouse();

        const drag=(o,resize=false)=>{
            this.dragModeSize=resize;
            this.dragStart=m;
            this.dragObj=o;
            this.dragOrig=(o.rect||o.pawn.rect).raw();
        };
        if(keyboard.isDown([key.n1,key.p1])){//platforms
            const o=new Platform({x:m.x,y:m.y,w:25,h:25});
            scene.platforms.push(o);
            drag(o,true);
        }
        else if(keyboard.isDown([key.n2,key.p2])){//door
            const o=new Door({x:m.x,y:m.y});
            scene.doors.push(o);
            drag(o);
        }
        else if(keyboard.isDown([key.n3,key.p3])){//npc
            const o=new NPC({x:m.x, y:m.y});
            scene.npcs.push(o);
            drag(o);
        }
        else if(keyboard.isDown([key.n4,key.p4])){//goal
            var x=this.snap(m.x);
            var y=this.snap(m.y);
            scene.goal(new Goal({x:x,y:y}));
        }
        else if(keyboard.isDown([key.n5,key.p5])){//goal
            const o=new Item({x:m.x, y:m.y});
            scene.items.push(o);
            drag(o);
        }
        else if(keyboard.isDown([key.n6,key.p6])){//goal
            const o=new Crate({x:m.x, y:m.y});
            scene.crates.push(o);
            drag(o);
        }
        else {
            const check=(a)=>{ //check to see if objects in array a are clicked on...
                for(var i in a){
                    const r=a[i].rect||a[i].pawn.rect;
                    if(r.hits(m)){
                        if(keyboard.isDown(key.q)){
                            a.splice(i,1);//destroy
                        } else if(keyboard.isDown(key.t)){
                            if(a[i].changeType)a[i].changeType();
                        } else {
                            drag(a[i],keyboard.isDown(key.r));//grab
                        }
                        break;
                    }
                }
            };
            check([scene.player.pawn]);
            check(scene.platforms);
            check(scene.npcs);
            check(scene.doors);
            check(scene.enemies);
            check(scene.items);
            check(scene.crates);
        }
        scene.ids();
    }
    handleDrag(){
        const d=scene.cam.worldMouse();
        d.x-=this.dragStart.x;
        d.y-=this.dragStart.y;
        const raw = Object.assign({},this.dragOrig);//make copy
        
        if(this.dragModeSize){
            raw.w+=d.x;
            raw.h+=d.y;
        }else{ 
            raw.x+=d.x;
            raw.y+=d.y;
        }
        if(raw.w<0){
            raw.x+=raw.w;
            raw.w*=-1;
        }
        if(raw.h<0){
            raw.y+=raw.h;
            raw.h*=-1;
        }
        
        raw.x=this.snap(raw.x);
        raw.y=this.snap(raw.y);
        raw.w=this.snap(raw.w);
        raw.h=this.snap(raw.h);
        
        if(raw.w==0)raw.w=this.snapSize;
        if(raw.h==0)raw.h=this.snapSize;
        
        (this.dragObj.rect||this.dragObj.pawn.rect).setRaw(raw);
        if(!mouse.isDown())this.dragObj=null;
    }
    draw(gfx){
        gfx.fillStyle="#000";
        gfx.font="8pt Courier";
        gfx.textAlign="left";
        gfx.textBaseline="hanging";
        gfx.fillText("== EDIT MODE ==", 10, 10);
        gfx.fillText(" ESC : exit edit mode", 10, 22);
        gfx.fillText("WASD : move cam", 10, 34);
        gfx.fillText("ENTR : export level data", 10, 46);
        gfx.fillText("   N : new level", 10, 58);
        
        const x=game.width()-200;
        gfx.fillText("== MOUSE CLICK MODIFIERS ==", x, 10);
        gfx.fillText(" +R : resize when dragging", x, 22);
        gfx.fillText(" +Q : destroy on click", x, 34);
        gfx.fillText(" +1 : spawn platform", x, 46);
        gfx.fillText(" +2 : spawn door", x, 60);
        gfx.fillText(" +3 : spawn npc", x, 72);
        gfx.fillText(" +4 : spawn goal", x, 84);
        gfx.fillText(" +5 : spawn item", x, 96);
        gfx.fillText(" +6 : spawn crate", x, 108);
        gfx.fillText(" +T : change type", x, 120);
    }
    serialize(){
        let res="[";
        const f=(t,a)=>{
            res+="{t:"+t.name+",d:[";
            let idx1=0;
            a.forEach(i=>{
                if(idx1++>0)res+=",";
                res+="{";
                const r=i.serialize();
                let idx2=0;
                for(var p in r){
                    if(idx2++>0)res+=",";
                    res+=p+":"+JSON.stringify(r[p]);
                }
                res+="}";
            });
            res+="]},";
        };
        f(Player,[scene.player]);
        if(scene.goal()){
            console.log("serializing goal");
            f(Goal,[scene.goal()]);
        }
        f(Platform,scene.platforms);
        f(NPC,scene.npcs);
        f(Door,scene.doors);
        f(Item,scene.items);
        f(Crate,scene.crates);
        res+="]";
        game.console.logData(res,"level data:");
    }
};