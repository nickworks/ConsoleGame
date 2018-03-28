function Keypad(x,y,onDone){
    this.index=0;
    this.val="";
    this.txt="CODE: ";
    this.x=x;
    this.y=y;
    
    this.color="#000";
    this.size=12;
    this.font="Arial";
    this.align="left";
    this.baseline="top";
    
    this.remove=false;
    this.timerBlink=0;
    this.showCursor=true;
    
    this.onDone=onDone;
    
    this.bg=new TalkBubble(0,0);
    
    this.append=function(txt){
        this.val+=txt;
        this.resizeBG(true);
    };
    this.resizeBG=function(snap=false){
        const size=game.gfx.measureText(this.txt+this.val+"_");
        this.bg.setSize(size.width,14);
        if(snap)this.bg.snap();
    };
    this.readyFont=function(gfx){
        gfx.fillStyle = this.color;
        gfx.font = this.size + "px " + this.font;
        gfx.textAlign = this.align;
        gfx.textBaseline = this.baseline;
    };
    this.update=function(dt){
        this.timerBlink-=dt;
        if(this.timerBlink<=0){
            this.showCursor=!this.showCursor;
            this.timerBlink=.5;
        }
        this.bg.update(dt); 
        if(keyboard.onDown([keycode.n0,keycode.p0])) this.append("0");
        if(keyboard.onDown([keycode.n1,keycode.p1])) this.append("1");
        if(keyboard.onDown([keycode.n2,keycode.p2])) this.append("2");
        if(keyboard.onDown([keycode.n3,keycode.p3])) this.append("3");
        if(keyboard.onDown([keycode.n4,keycode.p4])) this.append("4");
        if(keyboard.onDown([keycode.n5,keycode.p5])) this.append("5");
        if(keyboard.onDown([keycode.n6,keycode.p6])) this.append("6");
        if(keyboard.onDown([keycode.n7,keycode.p7])) this.append("7");
        if(keyboard.onDown([keycode.n8,keycode.p8])) this.append("8");
        if(keyboard.onDown([keycode.n9,keycode.p9])) this.append("9");
        if(keyboard.onDown(keycode.enter)) this.end(true);
        if(keyboard.onDown(keycode.escape)) this.end(false);
    };
    this.draw=function(gfx){
        scene.cam.drawStart(gfx);
        gfx.translate(this.x,this.y);
        this.bg.draw(gfx);
        this.readyFont(gfx);
        const p=this.bg.pos();
        let o=this.txt+this.val;
        if(this.showCursor)o+="_";
        if(this.bg.p>=1)gfx.fillText(o, p.x, p.y);
        gfx.resetTransform();
        scene.cam.drawEnd(gfx);
    };
    this.end=function(submit){
        this.remove=true;
        if(submit&&this.onDone)this.onDone(this.val);
    };
    this.resizeBG();
}