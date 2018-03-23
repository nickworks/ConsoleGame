function Editor(){
    scene.cam.target=null;
    this.dragObj=null;
    this.dragOrig=null;//original position of obj
    this.dragStart=null;//original position of mouse
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
        const objs=[scene.player].concat(
            scene.platforms,
            scene.npcs,
            scene.doors
        );
        let obj=null;
        for(var i in objs){
            if(objs[i].rect.hits(m)){
                obj=objs[i];
                this.dragStart=m;
                this.dragOrig={x:obj.rect.x,y:obj.rect.y};
                break;
            }
        }
        this.dragObj=obj;
    }
    this.handleDrag=function(){
        const d=scene.cam.worldMouse();
        d.x-=this.dragStart.x;
        d.y-=this.dragStart.y;
        const pos={
            x:this.dragOrig.x+d.x,
            y:this.dragOrig.y+d.y
        };
        this.dragObj.rect.setPosition(pos, 25);
        if(!mouse.isDown())this.dragObj=null;
    };
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        gfx.font="8pt Arial";
        gfx.textAlign="left";
        gfx.textBaseline="hanging";
        gfx.fillText("== EDIT MODE ==", 10, 10);
        gfx.fillText("ESC : exit mode", 10, 22);
        gfx.fillText("WASD: move cam", 10, 34);
    };
};