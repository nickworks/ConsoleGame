function Editor(){
    this.dragObj=null;
    this.dragOrig=null;//original position of obj
    this.dragStart=null;//original position of mouse
    this.update=function(dt){
        if(mouse.onDown()) this.handleClick();
        if(this.dragObj) this.handleDrag();
        if(keyboard.onDown(keycode.escape)){
            this.remove=true;
        }
    };
    this.handleClick=function(){
        const m=level.cam.worldMouse();
        const objs=[level.player].concat(
            level.platforms,
            level.npcs,
            level.doors
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
        const d=level.cam.worldMouse();
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
        gfx.fillText("EDIT MODE (escape to exit)", 10, 10);
    };
};