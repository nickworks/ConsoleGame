const LevelData={
    deserialize:function(d){
        const objs={
            player:null,
            goal:null,
            platforms:[],
            npcs:[],
            doors:[],
            items:[],
        };
        d.forEach(t=>{
            t.d.forEach(o=>{
                const j=new t.t(o);
                switch(t.t){
                    case Player:objs.player=j;break;
                    case Platform:objs.platforms.push(j);break;
                    case Door:objs.doors.push(j);break;
                    case NPC:objs.npcs.push(j);break;
                    case Item:objs.items.push(j);break;
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
        [{t:Player,d:[{i:1,x:-1678,y:155}]},{t:Platform,d:[{i:48,x:-1000,y:200,w:1650,h:100},{i:49,x:-2150,y:275,w:1225,h:125},{i:50,x:-1700,y:-250,w:600,h:150},{i:51,x:400,y:-250,w:75,h:350},{i:52,x:-175,y:-250,w:75,h:350},{i:53,x:-1000,y:-150,w:300,h:250},{i:54,x:-2175,y:-25,w:175,h:500},{i:55,x:-2000,y:125,w:125,h:25,o:1},{i:56,x:-1825,y:50,w:275,h:25,o:1},{i:57,x:-1625,y:-100,w:75,h:150},{i:58,x:-2175,y:-525,w:100,h:500},{i:59,x:-2075,y:-100,w:250,h:25,o:1},{i:60,x:-700,y:75,w:300,h:25,o:1},{i:61,x:-1775,y:200,w:300,h:100},{i:62,x:-1825,y:-175,w:125,h:25,o:1},{i:63,x:-2000,y:-25,w:75,h:25,o:1},{i:64,x:-1975,y:-175,w:150,h:75},{i:65,x:-575,y:125,w:100,h:75},{i:66,x:-1150,y:-50,w:150,h:25,o:1},{i:68,x:-1050,y:-125,w:50,h:25,o:1},{i:69,x:-1550,y:25,w:350,h:25},{i:70,x:-775,y:-400,w:75,h:250},{i:71,x:-1350,y:-475,w:100,h:125},{i:72,x:-700,y:0,w:75,h:75},{i:74,x:-1250,y:-475,w:550,h:75}]},{t:NPC,d:[{i:2,x:-325,y:155,d:["$0 Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets.","I don't have the key code for this door. You'll need to talk to "],f:true,a:800,h:20,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-1400,y:225,d:["Hello, player!","Welcome to the game."],f:true,a:800,h:50},{i:73,x:125,y:150,d:[],f:false,a:400,h:50}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":4,"f":"seeFar"}]},{i:6,x:425,y:100,l:1},{i:46,x:-1325,y:-350,l:0},{i:47,x:-725,y:100,l:0}]},{t:Item,d:[]},],
        //[{t:Player,d:[{i:1,x:-1167,y:249}]},{t:Platform,d:[{i:7,x:-1000,y:200,w:1650,h:100},{i:8,x:-2150,y:275,w:1225,h:125},{i:9,x:-1700,y:-250,w:600,h:150},{i:10,x:400,y:-250,w:75,h:350},{i:11,x:-175,y:-250,w:75,h:350},{i:12,x:-1050,y:-150,w:300,h:275},{i:13,x:-2175,y:-75,w:175,h:500},{i:14,x:-2000,y:150,w:125,h:25,o:1},{i:15,x:-1825,y:25,w:250,h:25,o:1},{i:16,x:-1625,y:-100,w:75,h:150},{i:17,x:-2175,y:-200,w:100,h:125},{i:18,x:-1950,y:-225,w:150,h:50},{i:19,x:-700,y:125,w:300,h:25,o:1}]},{t:NPC,d:[{i:2,x:-325,y:175,d:["$0 Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets.","I don't have the key code for this door. You'll need to talk to "],f:true,a:800,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-825,y:-175,d:["Hello, player!","Welcome to the game."],f:true,a:800},{i:4,x:125,y:175,d:[],f:false,a:800,onDeath:[{"i":6,"f":"forceOpen"}]}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":4,"f":"seeFar"}]},{i:6,x:425,y:100,l:1}]},{t:Item,d:[{i:20,x:-625,y:25},{i:21,x:-550,y:0}]},],
        [{t:Player,d:[{x:0,y:0}]},{t:Platform,d:[{x:-125,y:50,w:475,h:100}]},{t:NPC,d:[]},{t:Door,d:[]},]
    ],
    level:function(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}