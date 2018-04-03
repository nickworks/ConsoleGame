function Door(raw={}){
    var id=raw.i||0;
    this.rect=new Rect(raw.x||0,raw.y||0,25,100);
    this.animating=false;
    this.done=false;
    this.rectA=null;
    this.rectB=null;
    this.timer=0;
    this.timespan=1;
    this.lockCode=null;
    this.canActivate=false;
    
    var isOpen=false;
    var hint=new BubbleHint("OPEN");
    
    this.callbacks={
        onOpen:Callback.from(raw.onOpen),
        onClose:Callback.from(raw.onClose),
    };
    this.serialize=function(){
        let data={
            i:id,
            x:this.rect.x,
            y:this.rect.y,
            l:this.lockCode?1:0,
        };
        var a=Callback.serialize(this.callbacks.onOpen);
        var b=Callback.serialize(this.callbacks.onClose);
        if(a&&a.length>0)data.onOpen=a;
        if(b&&b.length>0)data.onClose=b;
        return data;
    };
    this.id=function(i){
        if(i)id=i;
        return id;  
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
            if(keyboard.onDown(key.activate()))this.activate();
        }
    };
    this.activate=function(){
        if(this.canActivate){
            if(this.lockCode){
                if(isOpen)this.close();
                else{
                    const p=this.rect.mid();
                    scene.modal=new Keypad(p.x,p.y,(v)=>this.open(v));
                }
            }else{
                isOpen?this.close():this.open();
            }
        }
    };
    this.draw=function(gfx){
        this.rect.draw(gfx);
        
        gfx.drawImage(this.lockCode?sprites.door2:sprites.door1,this.rect.x,this.rect.y-(100-this.rect.h));
        
        if(this.canActivate&&!scene.modal&&!this.animating){
            hint.x=this.rect.mid().x;
            hint.y=this.rect.mid().y-10;
            hint.draw(gfx);
        }
    };
    this.lock=function(){
        this.lockCode=parseInt(Math.random()*10000+10000).toString();
        hint.setText("UNLOCK");
    };
    this.open=function(code){
        if(this.lockCode && this.lockCode != code){
            consoleObj.log("\\ Access Denied");
            return;
        }
        
        this.animate({h:25});
        isOpen=true;
        hint.setText("CLOSE");
        Callback.do(this.callbacks.onOpen);
    };
    this.forceOpen=function(){
        this.open(this.lockCode);
    };
    this.close=function(){
        this.animate({h:100});
        isOpen=false;
        hint.setText(this.lockCode?"UNLOCK":"OPEN");
        Callback.do(this.callbacks.onClose);
    };
    this.getLockCode=function(){
        return this.lockCode;
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
    this.block=function(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            if(o.isAsleep)return;//skip sleeping objects
            const rect=(o.pawn?o.pawn.rect:o.rect);
            if(!rect||!rect.overlaps(this.rect))return;//return if not overlapping
            const fix=this.rect.findFix(rect);
            (o.pawn
                ?o.pawn.applyFix(fix)
                :o.applyFix(fix));
        });
    };
    this.changeType=function(){
        if(this.lockCode==null){
            this.lock();
        }else this.lockCode=null;
    };
    this.openIfPlayerHasEnoughCoins=function(p){
        const c=p.c||100;
        if(Player.data.coins>=c)this.forceOpen();  
    };
    if(!!raw.l)this.lock();
}