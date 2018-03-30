function Item(raw={}){
    var id=raw.i||0;
    this.type=raw.t||0;
    this.rect=Rect.from(raw);
    this.vx=0;
    this.vy=0;
    this.isAsleep=false;
    this.dead=false;
    this.serialize=function(){
        return{
            i:id,
            x:this.pawn.rect.x|0,
            y:this.pawn.rect.y|0,
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
    };
    this.draw=function(gfx){
        
        this.rect.draw(gfx);
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
}