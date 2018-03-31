function Item(raw={}){
    
    const TYPE_HEAL=1;
    const TYPE_AMMO=2;
    const TYPE_COIN=3;
    
    var id=raw.i||0;
    this.type=raw.t||0;
    this.amt=raw.a||25;
    this.rect=Rect.from(raw);
    this.vx=0;
    this.vy=0;
    this.isAsleep=false;
    this.dead=false;
        
    this.serialize=function(){
        return{
            i:id,
            x:this.rect.x|0,
            y:this.rect.y|0,
            t:this.type|0,
            a:this.amt|0,
        };
    };
    this.id=function(i){
        if(i)id=i;
        return id;  
    };
    this.update=function(dt){
        if(!this.isAsleep){
            if(this.isGrounded){
                var move=0;
                if(this.vx<0)move+=2;
                if(this.vx>0)move-=2;
                this.vx+=move*400*dt;
                if(move<0&&this.vx<0)this.vx=0;
                if(move>0&&this.vx>0)this.vx=0;
                if(this.vx==0&&this.vy==0)this.isAsleep=true;
            }            
            
            this.vy+=800*dt;
            this.rect.x+=this.vx*dt;
            this.rect.y+=this.vy*dt;
            this.isGrounded=false;
            this.rect.speed();
        }
    };
    this.activate=function(){
        this.dead=true;
        switch(this.type){
            case TYPE_HEAL:scene.player.heal(25);break;
            case TYPE_AMMO:scene.player.pawn.weapon.addAmmo(25);break;
            case TYPE_COIN:break;
        }
    };
    this.draw=function(gfx){
        
        var img;
        if(this.type==TYPE_HEAL)img=sprites.item1;
        if(this.type==TYPE_AMMO)img=sprites.item2;
        if(this.type==TYPE_COIN)img=sprites.item3;
        
        if(img)gfx.drawImage(img, this.rect.x, this.rect.y);
        else this.rect.draw(gfx);
    };
    this.applyFix=function(fix){
        this.rect.x+=fix.x;
        this.rect.y+=fix.y;
        if(fix.x!=0)this.vx*=-.5;
        if(fix.y<0) this.isGrounded=true;
        if(fix.y!=0){
            const before=this.vy;
            this.vy*=-.5;
            if(Math.abs(this.vy+before)<10) this.vy=0;
        }
        this.rect.cache();
    };
    this.changeType=function(){
        this.type++;
        if(this.type>3)this.type=1;
    };
}
Item.random=function(raw){
    raw.t=((Math.random()*3)|0)+1;
    const i=new Item(raw);
    i.vx=Math.random()*400-200;
    i.vy=-(Math.random()*200+200);
    return i;
};