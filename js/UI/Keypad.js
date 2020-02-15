class Keypad {
    constructor(x,y,onDone){
        this.index=0;
        this.val="";
        this.txt="CODE: ";
        this.x=x;
        this.y=y;
        this.zoom=true;
        this.font=new Font({valign:"top"});
        
        this.remove=false;
        this.timerBlink=0;
        this.showCursor=true;
        
        this.onDone=onDone;
        
        this.bg=new BubbleBG(0,0,"#FFF");
        this.resizeBG();
    }
    
    append(txt){
        this.val+=txt;
        this.resizeBG(true);
    }
    resizeBG(snap=false){
        const size=this.font.measure(game.gfx(),this.txt+this.val+"_");
        this.bg.setSize(size.width,14);
        if(snap)this.bg.snap();
    }
    update(dt){
        this.timerBlink-=dt;
        if(this.timerBlink<=0){
            this.showCursor=!this.showCursor;
            this.timerBlink=.5;
        }
        this.bg.update(dt); 
        if(keyboard.onDown([key.n0,key.p0])) this.append("0");
        if(keyboard.onDown([key.n1,key.p1])) this.append("1");
        if(keyboard.onDown([key.n2,key.p2])) this.append("2");
        if(keyboard.onDown([key.n3,key.p3])) this.append("3");
        if(keyboard.onDown([key.n4,key.p4])) this.append("4");
        if(keyboard.onDown([key.n5,key.p5])) this.append("5");
        if(keyboard.onDown([key.n6,key.p6])) this.append("6");
        if(keyboard.onDown([key.n7,key.p7])) this.append("7");
        if(keyboard.onDown([key.n8,key.p8])) this.append("8");
        if(keyboard.onDown([key.n9,key.p9])) this.append("9");
        if(keyboard.onDown(key.menuChoose())) this.end(true);
        if(keyboard.onDown(key.exit())) this.end(false);
    }
    draw(gfx){
        //gfx.fillStyle="rgba(0,0,0,.5)";
        //gfx.fillRect(0,0,800,400);
        game.view.clear("rgba(0,0,0,.5)");
        scene.cam.drawStart(gfx);
        Matrix.push();
        Matrix.translate(this.x,this.y);
        this.bg.draw(gfx);
        this.font.apply(gfx);
        const p=this.bg.pos();
        let o=this.txt+this.val;
        if(this.showCursor)o+="_";
        if(this.bg.p>=1)gfx.fillText(o, p.x, p.y);
        Matrix.pop();
        scene.cam.drawEnd(gfx);
    }
    end(submit){
        this.remove=true;
        if(submit&&this.onDone)this.onDone(this.val);
    }
    
}