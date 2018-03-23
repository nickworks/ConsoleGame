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
            scene.cam.target=scene.player;
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

        const check=(a)=>{
            for(var i in a)if(a[i].rect.hits(m)){
                if(keyboard.isDown(keycode.q)){
                    a.splice(i,1);
                } else {
                    this.dragModeSize=keyboard.isDown(keycode.r);
                    this.dragStart=m;
                    this.dragObj=a[i];
                    this.dragOrig=a[i].rect.raw();
                }
                break;
            }
        };
        check(scene.platforms);
        check(scene.npcs);
        check(scene.doors);
        check(scene.enemies);
        
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
        this.dragObj.rect.setRaw(raw, 25);
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
        gfx.fillText("   R : resize when dragging", 10, 46);
        gfx.fillText("   Q : destroy on click", 10, 58);

    };
};