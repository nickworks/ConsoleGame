function deserialize(d){
    const objs={
        player:null,
        platforms:[],
        npcs:[],
        enemies:[],
        doors:[]
    };
    d.forEach(t=>{
        t.d.forEach(o=>{
            const j=new t.t(o);
            switch(t.t){
                case Player:objs.player=j;break;
                case Platform:objs.platforms.push(j);break;
                case Door:objs.doors.push(j);break;
                case Enemy:objs.enemies.push(j);break;
                case NPC:objs.npcs.push(j);break;
            }
        })
    });
    return objs;
}
function serialize(){
    let res="[";
    const f=(t,a)=>{
        res+="{t:"+t.name+",d:[";
        a.forEach(i=>{
            const r=(i.rect||i.pawn.rect).raw();
            res+="{x:"+r.x;
            res+=",y:"+r.y;
            res+=",w:"+r.w;
            res+=",h:"+r.h;
            res+="},";
        });
        res+="]},";
    };
    f(Player,[scene.player]);
    f(Platform,scene.platforms);
    f(NPC,scene.npcs);
    f(Enemy,scene.enemies);
    f(Door,scene.doors);
    res+="]";
    return res;
}

function Level1(n){
    
    const d = [{t:Player,d:[{x:0,y:175,w:25,h:25},]},{t:Platform,d:[{x:-1000,y:200,w:1100,h:100},{x:100,y:150,w:100,h:100},{x:200,y:200,w:100,h:100},]},{t:NPC,d:[{x:100,y:100,w:25,h:25},]},{t:Enemy,d:[{x:100,y:125,w:25,h:25},]},{t:Door,d:[{x:300,y:100,w:25,h:100},]},];
    
    const objs=deserialize(d);
    
    //make internal references here...
    
    return objs;
}