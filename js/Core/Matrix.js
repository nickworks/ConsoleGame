function Matrix(raw={}){
    
    this.inverse=raw.inverse?new Matrix():null;
    this.set=function(raw){
        this.a=raw.a||1;
        this.b=raw.b||0;
        this.c=raw.c||0;
        this.d=raw.d||1;
        this.e=raw.e||0;
        this.f=raw.f||0;
    };
    this.set(raw);
    this.scale=function(s){
        this.mult(new Matrix({a:s,d:s}));
        //this.inverse.mult(new Matrix({a:1/s,b:1/s}),true);
    };
    this.translate=function(x,y){
        this.mult(new Matrix({e:x,f:y}));
        //this.inverse.mult(new Matrix({e:-x,f:-y}),true);
    };
    this.rotate=function(a){
        const rot=(r)=>{
            const cos=Math.cos(r);
            const sin=Math.sin(r);
            return new Matrix({a:cos,b:sin,c:-sin,d:cos});
        };
        this.mult(rot(a));
        //this.inverse.mult(rot(-a),true);
    };
    this.mult=function(m,reverse=false){
        if(reverse) this.set(Matrix.mult(m,this));
        else this.set(Matrix.mult(this,m));
    };
    this.vec=function(p){
        const raw={};
        raw.x=this.a*p.x+this.c*p.y+this.e;
        raw.y=this.b*p.x+this.d*p.y+this.f;
        return raw;    
    };
    this.apply=function(gfx){
        gfx.setTransform(this.a,this.b,this.c,this.d,this.e, this.f);
    };
};
Matrix.stack=[new Matrix({inverse:true})];
Matrix.push=function(){
    Matrix.stack.push(new Matrix({inverse:true}));
};
Matrix.pop=()=>{
    Matrix.stack.pop();
    Matrix.apply();
};
Matrix.last=()=>{
    const s=Matrix.stack.length;
    return (s<=0)?new Matrix():Matrix.stack[s-1];
};
Matrix.scale=(s)=>{
    Matrix.last().scale(s);
    Matrix.apply();
};
Matrix.translate=(x,y)=>{
    Matrix.last().translate(x,y);
    Matrix.apply();
};
Matrix.rotate=(r)=>{
    Matrix.last().rotate(r);
    Matrix.apply();
};
Matrix.apply=()=>{
    const res=new Matrix();
    Matrix.stack.forEach(m=>{
        res.mult(m);
    });
    game.gfx().setTransform(res.a,res.b,res.c,res.d,res.e,res.f);
};
Matrix.inverse=()=>{ // we might not need this feature...
    const res=new Matrix();
    for(var i=Matrix.stack.length-1;i>=0;i--){
        const inv=Matrix.stack[i].inverse;
        if(inv)res.mult(inv);
    };
    return res;
};
Matrix.mult=(m1,m2)=>{
    const raw={};
    raw.a=m1.a*m2.a+m1.c*m2.b;
    raw.b=m1.b*m2.a+m1.d*m2.b;
    raw.c=m1.a*m2.c+m1.c*m2.d;
    raw.d=m1.b*m2.c+m1.d*m2.d;
    raw.e=m1.a*m2.e+m1.c*m2.f+m1.e;
    raw.f=m1.b*m2.e+m1.d*m2.f+m1.f;
    return raw;
};