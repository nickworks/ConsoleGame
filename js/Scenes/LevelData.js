const LevelData={
    deserialize:function(d){
        const objs={
            player:null,
            goal:null,
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
                    case Goal:objs.goal=j;break;
                }
            })
        });
        return objs;
    },
    empty:function(){
        return this.deserialize([{t:Player,d:[{x:0,y:0}]}]);
    },
    data:[
        [{t:Player,d:[{x:-525,y:175}]},{t:Goal,d:[{x:575,y:100,n:0}]},{t:Platform,d:[{x:-1000,y:200,w:1650,h:100},{x:-2150,y:275,w:1225,h:125},{x:-1700,y:-250,w:600,h:150},{x:400,y:-250,w:75,h:350},{x:-175,y:-250,w:75,h:350},{x:-1050,y:-150,w:300,h:275},{x:-2175,y:-75,w:175,h:500},{x:-2000,y:150,w:125,h:25},{x:-1825,y:25,w:250,h:25},{x:-1625,y:-100,w:75,h:150},{x:-2175,y:-200,w:100,h:125},{x:-1950,y:-225,w:150,h:50}]},{t:NPC,d:[{x:-325,y:175,d:["Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets.","Here... let me open the door for you."],f:true,a:800,onSpeak:[{"i":4,"f":"open"}]},{x:-825,y:-175,d:["Hello, player!","Welcome to the game."],f:true,a:800},{x:125,y:175,d:[],f:false,a:800,onDeath:[{"i":15,"f":"open"}]}]},{t:Door,d:[{x:-150,y:100,onOpen:[{"i":4,"f":"seeFar"}]},{x:425,y:100}]},],
        [{t:Player,d:[{x:0,y:0}]},{t:Platform,d:[{x:-125,y:50,w:475,h:100}]},{t:NPC,d:[]},{t:Door,d:[]},]
    ],
    level:function(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}