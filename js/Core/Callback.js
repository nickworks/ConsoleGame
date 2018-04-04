function Callback(id,func,params){
    //console.log("new callback: "+id+" "+func+" "+params);
    
    this.id=id;
    this.func=func;
    this.params=params;
    
    this.serialize=function(){
        const data={i:this.id,f:this.func};
        if(params)data.p=this.params;
        return data;
    };
    this.call=function(){
        var res=null
        //console.log("call obj("+id+")["+func+"]("+(params||{})+")");
        const o=scene.obj(this.id);
        if(o&&o[this.func])res=o[this.func](this.params||{});
        return res;
    };
}
Callback.from=function(raw=[]){
    if(!Array.isArray(raw))raw=[raw];
    const res=[];
    raw.forEach(r=>res.push(new Callback(r.i,r.f,r.p)));
    return res;
};
Callback.do=function(calls){
    //console.log("run callback group: ");
    if(!Array.isArray(calls))calls=[calls];
    var res=null;
    calls.forEach(c=>{res=c.call()}); // ERROR
    return res;
};
Callback.serialize=function(calls){
    var res=[];
    calls.forEach(c=>res.push(c.serialize())); // ERROR
    return res;
};