class Dialog extends Modal {
    constructor(x,y,texts,callbacks={}){
        super(x,y,1.5,0);
        if(typeof texts == "string") texts=[texts];
        if(!Array.isArray(texts)) texts=["ERROR: Dialogs should use an array of strings."];
        
        this.index=0;
        this.texts=texts;
        this.lines=[];
        this.w=200;//max width
        this.h=14;
        
        this.font=new Font({valign:"top"});
        
        this.timer=0;
        this.charNow=0;
        this.charMax=0;
        this.remove=false;
        
        this.callbacks={
            onSpeak:(callbacks?callbacks.onSpeak:[]),
            onData:(callbacks?callbacks.onData:[])
        };
        
        this.bg=new BubbleBG(0,0, "#FFF");
        this.showNext();
    }
    chopUpText(text){
        this.lines=[];
        const words = text.split(' ');
        let line='';
        for(var i in words){
            const t=line+words[i]+' ';
            if(i>0&&this.font.measure(t).width>this.w){
                this.lines.push(line);
                line=words[i]+' ';
            }else{
                line=t;
            }
        }
        this.lines.push(line);
    }
    update(){
        this.bg.update();
        this.offset.y=-this.bg.h.target/2;
        if(this.bg.p<1)return;
        if(this.charNow < this.charMax){
            this.timer-=game.time.dt;
            if(this.timer<0){
                this.charNow+=(keyboard.isDown(key.activate()))?4:1;
                this.timer=.04;
            }
        } else {
            if(keyboard.onDown(key.activate())) this.showNext();
        }
    }
    draw(){
        
        game.view.fill("rgba(0,0,0,.5)");
        scene.cam.drawStart();
        Matrix.push();
        Matrix.translate(this.x,this.y);
        this.bg.draw();
        const p=this.bg.pos();
        this.font.apply();
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
        Matrix.pop();
        scene.cam.drawEnd();
    }
    
    showNext(){
        if(this.index>=this.texts.length)this.endDialog();
        else {
            let txt=this.texts[this.index++];
            
            txt=txt.replace(/\$([0-9]+)/g,(s,p)=>{
                const cb=this.callbacks.onData?this.callbacks.onData[p|0]:null;
                return cb
                    ?Callback.do([cb]).toString()
                    :"???";
            });
            
            this.chopUpText(txt);
            this.charMax=txt.length;
            this.charNow=0;
            const w=(this.lines.length==1)
                ?this.font.measure(this.lines[0]).width
                :this.w;
            const h=this.h*this.lines.length;
            this.bg.setSize(w,h);
        }
    }
    endDialog(){
        this.close();
        Callback.do(this.callbacks.onSpeak);
    }
}