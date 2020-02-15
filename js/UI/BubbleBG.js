class BubbleBG {
    constructor(w,h,c,b){
        this.time=0;
        this.transTime=0.25;
        this.w={now:0,start:0,target:w};
        this.h={now:0,start:0,target:h};
        this.r={now:0,start:0,target:10};
        this.p=0;
        this.color=c||"#AAA";
        this.bg=b;
    }
    setSize(w,h){
        this.w.target=w/2;
        this.h.target=h;
        this.w.start=this.w.now;
        this.h.start=this.h.now;
        this.r.start=this.r.now;
        this.time=0;
        this.p=0;
    }
    snap(){
        this.p=1;
        this.w.now=this.w.target;
        this.h.now=this.h.target;
        this.r.now=this.r.target;
    }
    update(dt){
        this.time+=dt;
        if(this.p<1){
            this.p=this.time/this.transTime;
            if(this.p>1)this.p=1;
            this.r.now=this.lerp(this.r.start,this.r.target);
            this.w.now=this.lerp(this.w.start,this.w.target);
            this.h.now=this.lerp(this.h.start,this.h.target);
        }
    }
    lerp(a,b){
        return (b-a)*(this.p*this.p)+a;
    }
    draw(gfx){
        const al=Math.PI;
        const ad=al/2;
        const ar=0;
        const au=-ad;
        const a=5; //arrow size
        const w=this.w.now;
        const h=this.h.now;
        const r=this.r.now;
        
        gfx.beginPath();
        gfx.moveTo(0,0);
        gfx.lineTo(-a,-a);
        gfx.ellipse(-w,-a-r,r,r,0,ad,al,false);
        gfx.ellipse(-w,-a-r-h,r,r,0,al,au,false);
        gfx.ellipse( w,-a-r-h,r,r,0,au,ar,false);
        gfx.ellipse( w,-a-r,r,r,0,ar,ad,false);
        gfx.lineTo(a,-a);
        gfx.closePath();
        gfx.fillStyle=this.color;
        gfx.fill();
    }
    pos(){
        return{x:-this.w.now,y:-5-this.h.now-this.r.now};  
    }
}