class Keypad extends Modal {
    constructor(x,y,onDone){
        super();
        this.maxInputSize = 5; // only allow up to 5 characters
        this.zoom=2;
        this.index=0;
        this.val="";
        this.txt="";
        this.x=x;
        this.y=y;
        this.font=new Font({size:20, valign:"top", font:"monospace"});
        this.fontSmall=new Font({size:10, valign:"middle", align:"center"});
        this.textPos = {x:1, y:2};
        this.bttns=[];

        this.timerBlink=0;
        this.showCursor=true;
        
        this.onDone=onDone;
        
        this.bg=new BubbleBG(0,0,"#FFF");
        this.bg.r.target = 3; // set radius target size
        this.resizeBG();

        this.contentsAreShifted = false;
        this.bttns.push(new Button("7", ()=>this.append("7"), 0., 22, 18, 18, "center", true));
        this.bttns.push(new Button("8", ()=>this.append("8"), 20, 22, 18, 18, "center", true));
        this.bttns.push(new Button("9", ()=>this.append("9"), 40, 22, 18, 18, "center", true));
        this.bttns.push(new Button("4", ()=>this.append("4"), 0., 42, 18, 18, "center", true));
        this.bttns.push(new Button("5", ()=>this.append("5"), 20, 42, 18, 18, "center", true));
        this.bttns.push(new Button("6", ()=>this.append("6"), 40, 42, 18, 18, "center", true));
        this.bttns.push(new Button("1", ()=>this.append("1"), 0., 62, 18, 18, "center", true));
        this.bttns.push(new Button("2", ()=>this.append("2"), 20, 62, 18, 18, "center", true));
        this.bttns.push(new Button("3", ()=>this.append("3"), 40, 62, 18, 18, "center", true));
        this.bttns.push(new Button("0", ()=>this.append("0"), 0., 82, 18, 18, "center", true));
        this.bttns.push(new Button("enter", ()=>this.end(true), 20, 82, 38, 18, "center", true));
    }
    
    append(txt){
        this.val+=txt;
        if(this.val.length > this.maxInputSize) this.val = this.val.slice(0, this.maxInputSize);
        this.resizeBG(true);
    }
    resizeBG(snap=false){
        //const size=this.font.measure(this.txt+this.val+"_");
        //this.bg.setSize(size.width,14);

        this.bg.setSize(60,103);
        if(snap)this.bg.snap();
    }
    update(){
        
        this.bg.update();
        if(this.isFullSize()){

            this.timerBlink-=game.time.dt;
            if(this.timerBlink<=0){
                this.showCursor=!this.showCursor;
                this.timerBlink=.5;
            }

            this.bttns.forEach(b=>b.update(false, {x:this.x,y:this.y}));

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
    }
    isFullSize(){
        return this.bg.p>=1;
    }
    shiftContents(){
        this.contentsAreShifted = true;
        const p=this.bg.pos();
        p.x += 1;
        p.y += 2;
        this.textPos.x = p.x;
        this.textPos.y = p.y;
        this.bttns.forEach(b=>{
            b.rect.x += p.x;
            b.rect.y += p.y;
        });
    }
    draw(){
        //gfx.fillStyle="rgba(0,0,0,.5)";
        //gfx.fillRect(0,0,800,400);
        game.view.fill("rgba(0,0,0,.5)");
        scene.cam.drawStart();
        Matrix.push();
        Matrix.translate(this.x,this.y);
        this.bg.draw();

        if(this.isFullSize()){
            

            if(!this.contentsAreShifted) this.shiftContents();


            this.font.apply();
            let o=this.txt+this.val;
            if(this.showCursor && this.val.length < this.maxInputSize)o+="_";
            gfx.fillText(o, this.textPos.x, this.textPos.y);

            this.bttns.forEach(b=>b.draw());
        }
        Matrix.pop();
        scene.cam.drawEnd();
    }
    end(submit){
        this.close();
        if(submit&&this.onDone)this.onDone(this.val);
    }
    
}