function Door(raw={}){
    this.id=raw.i||0;
    this.rect=new Rect(raw.x||0,raw.y||0,25,100);
    this.animating=false;
    this.done=false;
    this.rectA=null;
    this.rectB=null;
    this.timer=0;
    this.timespan=1;
    this.lockCode=null;
    this.canActivate=false;
    
    this.callbacks={
        onOpen:(raw.onOpen||[]),
        onClose:(raw.onClose||[])
    };
    this.serialize=function(){
        let data={
            x:this.rect.x,
            y:this.rect.y
        };
        var a=this.callbacks.onOpen;
        var b=this.callbacks.onClose;
        if(a&&a.length>0)data.onOpen=a;
        if(b&&b.length>0)data.onClose=b;
        return data;
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
            this.canActivate=false;
        }else{
            this.canActivate=Rect.grow(this.rect, 25).overlaps(scene.player.pawn.rect);
            if(keyboard.onDown([keycode.e,keycode.enter]))this.activate();
        }
    };
    this.activate=function(){
        if(this.canActivate){
            if(this.lockCode){
                const p=this.rect.mid();
                scene.modal=new Keypad(p.x,p.y,(v)=>this.open(v));
            }else{
                this.open();
            }
        }
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);
    };
    this.lock=function(){
        this.lockCode=parseInt(Math.random()*10000+10000).toString();
    };
    this.open=function(code){
        if(this.lockCode && this.lockCode != code){
            consoleObj.log("Access Denied");
            return;
        }
        
        this.animate({h:25});
        scene.call(this.callbacks.onOpen);
    };
    this.close=function(){
        this.animate({h:100});
        scene.call(this.callbacks.onClose);
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