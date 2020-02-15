class Door {
    constructor(raw={}){
        this.oid=raw.i||0;
        this.rect=new Rect(raw.x||0,raw.y||0,25,100);
        this.animating=false;
        this.done=false;
        this.rectA=null;
        this.rectB=null;
        this.timer=0;
        this.timespan=1;
        this.lockCode=null;
        this.canActivate=false;
        
        this.isOpen=false;
        this.hint=new BubbleHint("OPEN");
        
        this.callbacks={
            onOpen:Callback.from(raw.onOpen),
            onClose:Callback.from(raw.onClose),
        };
        if(!!raw.l)this.lock();
    }
    serialize(){
        let data={
            i:this.oid,
            x:this.rect.x,
            y:this.rect.y,
            l:this.lockCode?1:0,
        };
        var a=Callback.serialize(this.callbacks.onOpen);
        var b=Callback.serialize(this.callbacks.onClose);
        if(a&&a.length>0)data.onOpen=a;
        if(b&&b.length>0)data.onClose=b;
        return data;
    }
    id(i){
        if(i)this.oid=i;
        return this.oid;  
    }
    update(dt){
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
    }
    activate(){
        if(this.canActivate){
            if(this.lockCode){
                if(this.isOpen)this.close();
                else{
                    const p=this.rect.mid();
                    scene.modal=new Keypad(p.x,p.y,(v)=>this.open(v));
                }
            }else{
                this.isOpen?this.close():this.open();
            }
        }
    }
    draw(gfx){
        this.rect.draw(gfx);
        
        gfx.drawImage(this.lockCode?sprites.door2:sprites.door1,this.rect.x,this.rect.y-(100-this.rect.h));
        
        if(this.canActivate&&!scene.modal&&!this.animating){
            this.hint.x=this.rect.mid().x;
            this.hint.y=this.rect.mid().y-10;
            this.hint.draw(gfx);
        }
    }
    lock(){
        this.lockCode=parseInt(Math.random()*10000+10000).toString();
        this.hint.setText("UNLOCK");
    }
    open(code){
        if(this.lockCode && this.lockCode != code){
            consoleObj.log("// Access Denied");
            return;
        }
        
        this.animate({h:25});
        this.isOpen=true;
        this.hint.setText("CLOSE");
        Callback.do(this.callbacks.onOpen);
    }
    forceOpen(){
        this.open(this.lockCode);
    }
    close(){
        this.animate({h:100});
        this.isOpen=false;
        this.hint.setText(this.lockCode?"UNLOCK":"OPEN");
        Callback.do(this.callbacks.onClose);
    }
    getLockCode(){
        return this.lockCode;
    }
    animate(dif, time=1){
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
    block(a){
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
    }
    changeType(){
        if(this.lockCode==null){
            this.lock();
        }else this.lockCode=null;
    }
    openIfPlayerHasEnoughCoins(p){
        const c=p.c||100;
        if(Player.data.coins>=c)this.forceOpen();  
    }
    
}