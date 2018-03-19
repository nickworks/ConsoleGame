function Rect(x,y,w,h){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.overlaps=function(o){
        const r=this;
        if(r.x>o.x+o.w) return false;
        if(r.x+r.w<o.x) return false;
        if(r.y>o.y+o.h) return false;
        if(r.y+r.h<o.y) return false;
        return true;
    };
    this.findFix=function(o){
        // how far to move o to get it out
        const r=this;
        let moveL=r.x-(o.x+o.w);
        let moveR=(r.x+r.w)-r.x;
        let moveU=r.y-(o.y+o.h);
        let moveD=(r.y+r.h)-r.y;
        const res={x:0,y:0};
        res.x=(Math.abs(moveL)<Math.abs(moveR))?moveL:moveR;
        res.y=(Math.abs(moveU)<Math.abs(moveD))?moveU:moveD;
        if(Math.abs(res.x)<Math.abs(res.y))
            res.y=0;
        else
            res.x=0;
        return res;
    };
}