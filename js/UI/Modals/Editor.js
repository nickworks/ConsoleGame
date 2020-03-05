class Editor extends Modal {
    constructor(){
        super();
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
    update(){

        if(mouse.onDown()) this.handleClick();
        if(this.dragObj) this.handleDrag();
        if(keyboard.onDown(key.escape)){
            scene.guis.editor = null;
            scene.cam.target=scene.player.pawn;
        }
        if(keyboard.onDown(key.enter)){
            this.serialize();
        }
        if(keyboard.onDown(key.n)){
            scene.fromData([]);
            scene.cam.target=null;
        }
        this.moveCam();
    }
    moveCam(){
        const c=scene.cam;
        const s=300;
        if(keyboard.isDown(key.w)) c.goals.y-=s*game.time._dt;
        if(keyboard.isDown(key.a)) c.goals.x-=s*game.time._dt;
        if(keyboard.isDown(key.s)) c.goals.y+=s*game.time._dt;
        if(keyboard.isDown(key.d)) c.goals.x+=s*game.time._dt;
        c.update();
    }
    handleClick(){
        
        const m=scene.cam.worldMouse();

        const drag=(o,resize=false)=>{
            this.dragModeSize=resize;
            this.dragStart=m;
            this.dragObj=o;
            this.dragOrig=o.rect.raw();
        };

        if(keyboard.isDown([key.n1,key.p1])){//platforms
            const o=new Platform({x:m.x,y:m.y,w:25,h:25});
            scene.objs.add(o);
            drag(o,true);
        }
        else if(keyboard.isDown([key.n2,key.p2])){//door
            const o=new Door({x:m.x,y:m.y});
            scene.objs.add(o);
            drag(o);
        }
        else if(keyboard.isDown([key.n3,key.p3])){//npc
            const o=new AIController({x:m.x, y:m.y});
            scene.objs.add(o.pawn);
            drag(o.pawn);
        }
        else if(keyboard.isDown([key.n4,key.p4])){//portal
            var x=this.snap(m.x);
            var y=this.snap(m.y);
            const o=new Portal({x:x,y:y});
            scene.objs.add(o);
            drag(o);
        }
        else if(keyboard.isDown([key.n5,key.p5])){//item
            const o=new Item({x:m.x, y:m.y});
            scene.objs.add(o);
            drag(o);
        }
        else if(keyboard.isDown([key.n6,key.p6])){//crate
            const o=new Crate({x:m.x, y:m.y});
            scene.objs.add(o);
            drag(o);
        }
        else {
            const check=(a)=>{ //check to see if objects in array a are clicked on...
                // assuming the objects are drawn back-to-front, loop
                // through them in reverse to click on top objects first:
                for(var i=a.length-1;i>=0;i--){
                    const r=a[i].rect;
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
            check(scene.objs.all);
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
        
        (this.dragObj.rect).setRaw(raw);
        if(!mouse.isDown())this.dragObj=null;
    }
    draw(){
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

        if(this.dragObj){
            const r = this.dragObj.rect;
            scene.cam.drawStart();
            gfx.strokeStyle="#F00";
            gfx.lineWidth=3;
            gfx.strokeRect(r.x,r.y,r.w,r.h);
            scene.cam.drawEnd();
        }
    }
    serialize(){
        const res = LevelData.serialize();
        game.console.logData(res,"level data:");
    }
};