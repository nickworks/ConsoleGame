function Callback(id,func,params){
    //console.log("new callback: "+id+" "+func+" "+params);
    this.serialize=function(){
        const data={i:id,f:func};
        if(params)data.p=params;
        return data;
    };
    this.call=function(){
        var res=null
        //console.log("call obj("+id+")["+func+"]("+(params||{})+")");
        const o=scene.obj(id);
        if(o&&o[func])res=o[func](params||{});
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