function spawnObjects(d){
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

function Level1(n){
    
    const d = [
        {t:Player,d:[{x:0,y:0}]},
        {t:Platform,d:[
            {x:-1000,y:200,w:1100,h:100},
            {x:  100,y:150,w: 100,h:100},
            {x:  200,y:200,w: 100,h:100},
        ]},
        {t:NPC,d:[
            {x:100,y:100}
        ]},
        {t:Enemy,d:[
            {x:100,y:100}
        ]},
        {t:Door,d:[
            {x:300,y:100}
        ]}
    ];
    
    const objs=spawnObjects(d);
    
    //make internal references here...
    
    return objs;
}