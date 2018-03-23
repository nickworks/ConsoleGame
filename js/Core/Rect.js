function Rect(x,y,w,h){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.copy=function(){
        return new Rect(this.x,this.y,this.w,this.h);
    };
    this.hits=function(p){
        return (p.x>this.x&&p.x<this.x+this.w&&p.y>this.y&&p.y<this.y+this.h);
    };
    this.overlaps=function(o){
        const r=this;
        if(r.x>o.x+o.w) return false;
        if(r.x+r.w<o.x) return false;
        if(r.y>o.y+o.h) return false;
        if(r.y+r.h<o.y) return false;
        return true;
    };
    this.groupCheck=function(g,o){
        g.forEach(i=>{
            if(this.overlaps(i.rect)) o(i);
        });
    };
    this.findFix=function(o){
        // how far to move o to get it out
        const r=this;
        let moveL=r.x-(o.x+o.w);
        let moveR=(r.x+r.w)-o.x;
        let moveU=r.y-(o.y+o.h);
        let moveD=(r.y+r.h)-o.y;
        const res={x:0,y:0};
        res.x=(Math.abs(moveL)<Math.abs(moveR))?moveL:moveR;
        res.y=(Math.abs(moveU)<Math.abs(moveD))?moveU:moveD;
        if(Math.abs(res.x)<Math.abs(res.y))
            res.y=0;
        else
            res.x=0;
        return res;
    };
    this.toString=function(){
        return "{"+this.x+", "+this.y+", "+this.w+", "+this.h+"}";
    };
    this.setRaw=function(raw,snap=1){
        this.x=Math.round(raw.x/snap)*snap;
        this.y=Math.round(raw.y/snap)*snap;
        this.w=Math.round(raw.w/snap)*snap;
        this.h=Math.round(raw.h/snap)*snap;
        if(this.w<snap)this.w=snap;
        if(this.h<snap)this.h=snap;
    };
    this.draw=function(gfx){
        gfx.fillRect(this.x,this.y,this.w,this.h);
    };
    this.raw=function(){
        return {x:this.x,y:this.y,w:this.w,h:this.h};
    };
    this.mid=function(){
        return {x:this.x+this.w/2,y:this.y+this.h/2};
    };
    this.mouseOver=function(){
        return(scene.cam && this.hits(scene.cam.worldMouse()));
    }
}
Rect.lerp=function(a,b,t){
    let x=a.x+(b.x-a.x)*t;
    let y=a.y+(b.y-a.y)*t;
    let w=a.w+(b.w-a.w)*t;
    let h=a.h+(b.h-a.h)*t;
    return new Rect(x,y,w,h);
};