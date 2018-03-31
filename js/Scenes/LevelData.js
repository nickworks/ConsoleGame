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
        [{t:Player,d:[{i:1,x:-1268,y:230}]},{t:Goal,d:[{x:550,y:100,n:0}]},{t:Platform,d:[{i:112,x:-1000,y:200,w:1650,h:100},{i:113,x:-2150,y:275,w:1225,h:125},{i:114,x:-1700,y:-250,w:600,h:150},{i:115,x:400,y:-250,w:75,h:350},{i:116,x:-175,y:-250,w:75,h:350},{i:117,x:-1000,y:-150,w:300,h:250},{i:118,x:-2175,y:-25,w:175,h:500},{i:119,x:-2000,y:125,w:125,h:25,o:1},{i:120,x:-1825,y:50,w:275,h:25,o:1},{i:121,x:-1625,y:-100,w:75,h:150},{i:122,x:-2175,y:-525,w:100,h:500},{i:123,x:-2075,y:-100,w:250,h:25,o:1},{i:124,x:-700,y:75,w:300,h:25,o:1},{i:125,x:-1775,y:200,w:300,h:100},{i:126,x:-1825,y:-175,w:125,h:25,o:1},{i:127,x:-2000,y:-25,w:75,h:25,o:1},{i:128,x:-1975,y:-175,w:150,h:75},{i:129,x:-575,y:125,w:100,h:75},{i:130,x:-1150,y:-50,w:150,h:25,o:1},{i:131,x:-1050,y:-125,w:50,h:25,o:1},{i:132,x:-1550,y:25,w:350,h:25},{i:133,x:-775,y:-400,w:75,h:250},{i:134,x:-1350,y:-475,w:100,h:125},{i:135,x:-700,y:0,w:75,h:75},{i:136,x:-1250,y:-475,w:550,h:75},{i:137,x:650,y:275,w:125,h:-350}]},{t:NPC,d:[{i:2,x:-325,y:150,d:["$0 Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets."],f:true,a:800,h:20,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-1575,y:150,d:["Hello, player!","Welcome to the game."],f:true,a:800,h:50},{i:73,x:125,y:150,d:[],f:false,a:400,h:50,onDeath:[{"i":6,"f":"forceOpen"}]},{i:99,x:-900,y:150,d:["If you bring me 10 coins, I'll open this door for you!"],f:true,a:400,h:50,onSpeak:[{"i":47,"f":"openIfPlayerHas10Coins"}]}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":73,"f":"seeFar"}]},{i:6,x:425,y:100,l:1},{i:46,x:-1325,y:-350,l:0},{i:47,x:-725,y:100,l:1}]},{t:Item,d:[{i:100,x:-1450,y:-50,t:3,a:1},{i:101,x:-1400,y:-50,t:3,a:1},{i:102,x:-1500,y:-50,t:3,a:1},{i:103,x:-1350,y:-50,t:3,a:1},{i:104,x:-1300,y:-50,t:3,a:1},{i:105,x:-1975,y:225,t:3,a:1},{i:106,x:-1775,y:-125,t:3,a:1},{i:107,x:-1675,y:0,t:3,a:1},{i:108,x:-1725,y:0,t:3,a:1},{i:109,x:-1525,y:-300,t:3,a:1},{i:110,x:-1450,y:-300,t:3,a:1},{i:111,x:-1600,y:-300,t:3,a:1}]},],
        [{t:Player,d:[{x:0,y:0}]},{t:Platform,d:[{x:-125,y:50,w:475,h:100}]},{t:NPC,d:[]},{t:Door,d:[]},]
    ],
    level:function(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}