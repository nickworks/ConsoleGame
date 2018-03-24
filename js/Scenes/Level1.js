function deserialize(d){
    const objs={
        player:null,
        platforms:[],
        npcs:[],
        doors:[]
    };
    d.forEach(t=>{
        t.d.forEach(o=>{
            const j=new t.t(o);
            switch(t.t){
                case Player:objs.player=j;break;
                case Platform:objs.platforms.push(j);break;
                case Door:objs.doors.push(j);break;
                case NPC:objs.npcs.push(j);break;
            }
        })
    });
    return objs;
}

function Level1(n){
    
    //const d=[{t:Player,d:[{x:-750,y:175,w:25,h:25},]},{t:Platform,d:[{x:-1000,y:200,w:1325,h:100},{x:-1000,y:-100,w:1325,h:75},{x:-1000,y:-25,w:50,h:225},{x:275,y:-25,w:50,h:225},{x:-175,y:-25,w:75,h:125},{x:-525,y:100,w:150,h:100},]},{t:NPC,d:[{x:0,y:175,w:25,h:25},]},{t:Door,d:[{x:-150,y:100,w:25,h:100},]},];
    const d=[{t:Player,d:[{x:-750,y:175,},]},{t:Platform,d:[{x:-1000,y:200,w:1325,h:100,},{x:-1000,y:-100,w:1325,h:75,},{x:-1000,y:-25,w:50,h:225,},{x:275,y:-25,w:50,h:225,},{x:-175,y:-25,w:75,h:125,},{x:-525,y:100,w:150,h:100,},]},{t:NPC,d:[{x:0,y:175,d:["Hello, friend!"],f:true,},]},{t:Door,d:[{x:-150,y:100,},]},];
    
    
    const objs=deserialize(d);
    
    //make internal references here...
    
    return objs;
}