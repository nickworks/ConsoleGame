function Door(raw){
    this.rect=new Rect(raw.x,raw.y,25,100);
    this.animating=false;
    this.done=false;
    this.rectA=null;
    this.rectB=null;
    this.timer=0;
    this.timespan=1;
    this.serialize=function(){
        return{
            x:this.rect.x,
            y:this.rect.y
        };
    };
    this.update=function(dt){
        if(this.animating){
            this.timer+=dt;
            var p = this.timer/this.timespan;
            if(p>1){
                p=1;
                this.done=true;
                this.animating=false;
            }
            this.rect=Rect.lerp(this.rectA, this.rectB, p);
        }
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);
    };
    this.open=function(){
        this.animate({h:25});
    };
    this.close=function(){
        this.animate({h:100});
    };
    this.animate=function(dif, time=1){
        this.animating=true;
        this.timer=0;
        this.timespan=time;
        this.rectA=this.rect.copy();
        this.rectB=this.rect.copy();
        if(dif.x)this.rectB.h=dif.x;
        if(dif.y)this.rectB.h=dif.y;
        if(dif.w)this.rectB.h=dif.w;
        if(dif.h)this.rectB.h=dif.h;
    }
}