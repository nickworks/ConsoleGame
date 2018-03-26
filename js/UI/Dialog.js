function Dialog(x,y,texts,callbacks){
    if(typeof texts == "string") texts=[texts];
    if(!Array.isArray(texts)) texts=["ERROR: Dialogs should use an array of strings."];
    
    this.index=0;
    this.texts=texts;
    this.lines=[];
    this.x=x;
    this.y=y;
    this.w=200;//max width
    this.h=14;
    
    this.color="#000";
    this.size=12;
    this.font="Arial";
    this.align="left";
    this.baseline="top";
    
    this.timer=0;
    this.charNow=0;
    this.charMax=0;
    this.remove=false;
    
    this.callbacks={
        onDone:callbacks
    };
    
    this.bg=new TalkBubble(0,0);
    
    this.display=function(text){
        this.charMax=text.length;
        this.charNow=0;
        //this.timer=this.charMax*.01;
        this.lines=[];
        this.readyFont(game.gfx);
        const words = text.split(' ');
        let line='';
        for(var i in words){
            const t=line+words[i]+' ';
            if(i>0&&game.gfx.measureText(t).width>this.w){
                this.lines.push(line);
                line=words[i]+' ';
            }else{
                line=t;
            }
        }
        this.lines.push(line);
        
        const w=(this.lines.length==1)?game.gfx.measureText(this.lines[0]).width:this.w;
        const h=this.h*this.lines.length;
        this.bg.setSize(w,h);
        
    };
    this.readyFont=function(gfx){
        gfx.fillStyle = this.color;
        gfx.font = this.size + "px " + this.font;
        gfx.textAlign = this.align;
        gfx.textBaseline = this.baseline;
    };
    this.update=function(dt){
        this.bg.update(dt);
        if(this.bg.p<1)return;
        if(this.charNow < this.charMax){
            this.timer-=dt;
            if(this.timer<0){
                this.charNow+=(keyboard.isDown([keycode.e, keycode.enter]))?4:1;
                this.timer=.04;
            }
        } else {
            if(keyboard.onDown([keycode.e, keycode.enter])) this.showNext();
        }
    };
    this.draw=function(gfx){
        scene.cam.drawStart(gfx);
        gfx.translate(this.x,this.y);
        this.bg.draw(gfx);
        const p=this.bg.pos();
        this.readyFont(gfx);
        var charOut=this.charNow;
        for(var n in this.lines){
            var str=this.lines[n];
            if(str.length<=charOut){
                charOut-=str.length;   
            } else {
                str=str.substr(0,charOut);
                charOut=0;
            }
            gfx.fillText(str, p.x, p.y+n*this.h);
        }
        gfx.resetTransform();
        scene.cam.drawEnd(gfx);
    };
    
    this.showNext=function(){
        if(this.index>=this.texts.length)this.endDialog();
        else this.display(this.texts[this.index++]);
    };
    this.endDialog=function(){
        this.remove=true;
        scene.call(this.callbacks.onDone);
    };
    this.showNext();
}