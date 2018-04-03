function Matrix(raw={}){
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
    };
    this.translate=function(x,y){
        this.mult(new Matrix({e:x,f:y}));
    };
    this.rotate=function(r){
        const cos=Math.cos(r);
        const sin=Math.sin(r);
        this.mult(new Matrix({a:cos,b:sin,c:-sin,d:cos}));
    };
    this.mult=function(m){
        const raw={};
        raw.a=this.a*m.a+this.c*m.b;
        raw.b=this.b*m.a+this.d*m.b;
        raw.c=this.a*m.c+this.c*m.d;
        raw.d=this.b*m.c+this.d*m.d;
        raw.e=this.a*m.e+this.c*m.f+this.e;
        raw.f=this.b*m.e+this.d*m.f+this.f;
        this.set(raw);
    };
    this.apply=function(gfx){
        gfx.setTransform(this.a,this.b,this.c,this.d,this.e, this.f);
    };
};
Matrix.stack=[new Matrix()];
Matrix.push=function(){
    Matrix.stack.push(new Matrix());
};
Matrix.pop=function(){
    Matrix.stack.pop();
    Matrix.apply();
};
Matrix.last=function(){
    const s=Matrix.stack.length;
    return (s<=0)?new Matrix():Matrix.stack[s-1];
};
Matrix.scale=function(s){
    Matrix.last().scale(s);
    Matrix.apply();
};
Matrix.translate=function(x,y){
    Matrix.last().translate(x,y);
    Matrix.apply();
};
Matrix.rotate=function(r){
    Matrix.last().rotate(r);
    Matrix.apply();
};
Matrix.apply=function(){
    const res=new Matrix();
    Matrix.stack.forEach(m=>{
        res.mult(m);
    });
    game.gfx().setTransform(res.a,res.b,res.c,res.d,res.e,res.f);
};