function Dialog(){
    this.lines=[];
    this.x=20;
    this.y=200;
    this.w=100;
    this.h=14;
    
    this.color="#000";
    this.size=12;
    this.font="Arial";
    this.align="left";
    this.baseline="Alphabtical";
    
    this.timer=0;
    this.charNow=0;
    this.charMax=0;
    
    this.display=function(gfx, text){
        this.charMax=text.length;
        this.readyFont(gfx);
        const words = text.split(' ');
        let line='';
        for(var i in words){
            const t=line+words[i]+' ';
            if(i>0&&gfx.measureText(t).width>this.w){
                this.lines.push(line);
                line=words[i]+' ';
            }else{
                line=t;
            }
        }
        this.lines.push(line);
    };
    this.readyFont=function(gfx){
        gfx.fillStyle = this.color;
        gfx.font = this.size + "px " + this.font;
        gfx.textAlign = this.align;
        gfx.textBaseline = this.baseline;
    };
    this.update=function(dt){
        if(this.charNow < this.charMax){
            this.timer-=dt;
            if(this.timer<0){
                this.charNow+=(keyboard.isDown(keycode.e))?4:1;
                this.timer=.04;
            }
        }
    };
    this.draw=function(gfx){
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
            gfx.fillText(str, this.x, this.y+n*this.h);
        }  
    };
}