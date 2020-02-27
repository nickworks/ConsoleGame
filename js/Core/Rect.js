class Rect {

    static grow(r,a){
        return new Rect(r.x-a/2,r.y-a/2,r.w+a,r.h+a);
    }
    static from(raw){
        return new Rect(raw.x,raw.y,raw.w,raw.h);
    }
    static lerp(a,b,t){
        let x=a.x+(b.x-a.x)*t;
        let y=a.y+(b.y-a.y)*t;
        let w=a.w+(b.w-a.w)*t;
        let h=a.h+(b.h-a.h)*t;
        return new Rect(x,y,w,h);
    }

    constructor(x,y,w,h){
        this.x=x||0;
        this.y=y||0;
        this.w=w||25;
        this.h=h||25;
        this.vx=0;
        this.vy=0;
        this.prev={};
        this.fix();
    }
    fix(){
        if(this.w<0){
            this.w*=-1;
            this.x-=this.w;
        }
        if(this.h<0){
            this.h*=-1;
            this.y-=this.h;
        }   
    }
    
    setRaw(raw){
        this.x=raw.x;
        this.y=raw.y;
        this.w=raw.w;
        this.h=raw.h;
        this.fix();
    }
    speed(){
        // calculate the velocity this rect is moving
        // IMPORTANT: this velocity is per-second! It has delta-time already applied.
        this.vx=this.x-this.prev.x;
        this.vy=this.y-this.prev.y;
        this.cache();
    }
    cache(){
        this.prev=this.raw();
    }
    copy(){
        return new Rect(this.x,this.y,this.w,this.h);
    }
    hits(p){
        return (p.x>this.x&&p.x<this.x+this.w&&p.y>this.y&&p.y<this.y+this.h);
    }
    overlaps(o){
        const r=this;
        if(r.x>=o.x+o.w) return false;
        if(r.x+r.w<=o.x) return false;
        if(r.y>=o.y+o.h) return false;
        if(r.y+r.h<=o.y) return false;
        return true;
    }
    groupCheck(g,o){
        g.forEach(i=>{
            if(this.overlaps(i.rect||i.pawn.rect)) o(i);
        });
    }
    findFix(o){
        
        // how far to move o to get it out
        const r=this;
        let moveL=r.x-(o.x+o.w);
        let moveR=(r.x+r.w)-o.x;
        let moveU=r.y-(o.y+o.h);
        let moveD=(r.y+r.h)-o.y;
        
        const res={x:0,y:0};
        res.x=(Math.abs(moveL)<Math.abs(moveR))?moveL:moveR;
        res.y=(Math.abs(moveU)<Math.abs(moveD))?moveU:moveD;
        
        if(o.vx>0&&res.x>0)res.x=0;
        else if(o.vx<0&&res.x<0)res.x=0;
        else if(o.vy>0&&res.y>0)res.y=0;
        else if(o.vy<0&&res.y<0)res.y=0;
        else if(Math.abs(res.x)<Math.abs(res.y))res.y=0;
        else res.x=0;
        return res;
    }
    toString(){
        return "{"+this.x+", "+this.y+", "+this.w+", "+this.h+"}";
    }
    draw(gfx){
        gfx.fillRect(this.x,this.y,this.w,this.h);
    }
    raw(){
        return {x:this.x,y:this.y,w:this.w,h:this.h};
    }
    mid(){
        return {x:this.x+this.w/2,y:this.y+this.h/2};
    }
    mouseOver(){
        return(scene.cam && this.hits(scene.cam.worldMouse()));
    }
}