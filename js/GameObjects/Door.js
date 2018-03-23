function Door(x,y){
    this.rect=new Rect(x,y,30,100);
    this.opening=false;
    this.done=false;
    this.rectA=null;
    this.rectB=null;
    this.timer=0;
    this.timespan=1;
    this.update=function(dt){
        if(keyboard.onDown(keycode.s)) this.open();
        if(this.opening){
            this.timer+=dt;
            var p = this.timer/this.timespan;
            if(p>1){
                p=1;
                this.done=true;
                this.opening=false;
            }
            this.rect=Rect.lerp(this.rectA, this.rectB, p);
        }
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);
    };
    this.open=function(){
        this.opening=true;
        this.rectA=this.rect.copy();
        this.rectB=this.rect.copy();
        this.rectB.h=20;
    };
}