function Editor(){
    scene.cam.target=null;
    this.dragObj=null;
    this.dragOrig=null;//original position of obj
    this.dragStart=null;//original position of mouse
    this.dragModeSize=false;
    this.update=function(dt){
        if(mouse.onDown()) this.handleClick();
        if(this.dragObj) this.handleDrag();
        if(keyboard.onDown(keycode.escape)){
            this.remove=true;
            scene.cam.target=scene.player.pawn;
        }
        this.moveCam(dt);        
    };
    this.moveCam=function(dt){
        const c=scene.cam;
        const s=300;
        if(keyboard.isDown(keycode.w)) c.ty-=s*dt;
        if(keyboard.isDown(keycode.a)) c.tx-=s*dt;
        if(keyboard.isDown(keycode.s)) c.ty+=s*dt;
        if(keyboard.isDown(keycode.d)) c.tx+=s*dt;
    };
    this.handleClick=function(){
        
        const m=scene.cam.worldMouse();
        const drag=(o,resize=false)=>{
            this.dragModeSize=resize;
            this.dragStart=m;
            this.dragObj=o;
            this.dragOrig=(o.rect||o.pawn.rect).raw();
        };
        if(keyboard.isDown(keycode["1"])){//platforms
            const o=new Platform(new Rect(m.x,m.y,1,1));
            scene.platforms.push(o);
            drag(o,true);
        }
        else if(keyboard.isDown(keycode["2"])){//door
            const o=new Door(m.x,m.y);
            scene.doors.push(o);
            drag(o);
        }
        else if(keyboard.isDown(keycode["3"])){//npc
            const o=new NPC();
            scene.npcs.push(o);
            drag(o);
        }
        else if(keyboard.isDown(keycode["4"])){//enemy
            const o=new Enemy(m.x,m.y);
            scene.enemies.push(o);
            drag(o);
        }
        else {
            const check=(a)=>{
                for(var i in a){
                    const r=a[i].rect||a[i].pawn.rect;
                    if(r.hits(m)){
                        if(keyboard.isDown(keycode.q)){
                            a.splice(i,1);//destroy
                        } else {
                            drag(a[i],keyboard.isDown(keycode.r));//grab
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
        }
    }
    this.handleDrag=function(){
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
        (this.dragObj.rect||this.dragObj.pawn.rect).setRaw(raw, 25);
        if(!mouse.isDown())this.dragObj=null;
    };
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        gfx.font="8pt Courier";
        gfx.textAlign="left";
        gfx.textBaseline="hanging";
        gfx.fillText("== EDIT MODE ==", 10, 10);
        gfx.fillText(" ESC : exit mode", 10, 22);
        gfx.fillText("WASD : move cam", 10, 34);
        gfx.fillText("LC+R : resize when dragging", 10, 46);
        gfx.fillText("LC+Q : destroy on click", 10, 58);
        gfx.fillText("LC+1 : spawn platform", 10, 70);
        gfx.fillText("LC+2 : spawn door", 10, 82);
        gfx.fillText("LC+3 : spawn npc", 10, 94);
        gfx.fillText("LC+4 : spawn enemy", 10, 106);
    };
};