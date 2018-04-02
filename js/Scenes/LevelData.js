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
        [{t:Player,d:[{i:1,x:-1268,y:230}]},{t:Goal,d:[{x:550,y:100,n:1}]},{t:Platform,d:[{i:112,x:-1000,y:200,w:1650,h:100},{i:113,x:-2150,y:275,w:1225,h:125},{i:114,x:-1700,y:-250,w:600,h:150},{i:115,x:400,y:-250,w:75,h:350},{i:116,x:-175,y:-250,w:75,h:350},{i:117,x:-1000,y:-150,w:300,h:250},{i:118,x:-2175,y:-25,w:175,h:500},{i:119,x:-2000,y:125,w:125,h:25,o:1},{i:120,x:-1825,y:50,w:275,h:25,o:1},{i:121,x:-1625,y:-100,w:75,h:150},{i:122,x:-2175,y:-525,w:100,h:500},{i:123,x:-2075,y:-100,w:250,h:25,o:1},{i:124,x:-700,y:75,w:300,h:25,o:1},{i:125,x:-1775,y:200,w:300,h:100},{i:126,x:-1825,y:-175,w:125,h:25,o:1},{i:127,x:-2000,y:-25,w:75,h:25,o:1},{i:128,x:-1975,y:-175,w:150,h:75},{i:129,x:-575,y:125,w:100,h:75},{i:130,x:-1150,y:-50,w:150,h:25,o:1},{i:131,x:-1050,y:-125,w:50,h:25,o:1},{i:132,x:-1550,y:25,w:350,h:25},{i:133,x:-775,y:-400,w:75,h:250},{i:134,x:-1350,y:-475,w:100,h:125},{i:135,x:-700,y:0,w:75,h:75},{i:136,x:-1250,y:-475,w:550,h:75},{i:137,x:650,y:275,w:125,h:-350}]},{t:NPC,d:[{i:2,x:-325,y:150,d:["$0 Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets."],f:true,a:800,h:20,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-1575,y:150,d:["Hello, player!","Welcome to the game."],f:true,a:800,h:50},{i:73,x:125,y:150,d:[],f:false,a:400,h:50,onDeath:[{"i":6,"f":"forceOpen"}]},{i:99,x:-900,y:150,d:["If you bring me 10 coins, I'll open this door for you!"],f:true,a:400,h:50,onSpeak:[{"i":47,"f":"openIfPlayerHas10Coins"}]}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":73,"f":"seeFar"}]},{i:6,x:425,y:100,l:1},{i:46,x:-1325,y:-350,l:0},{i:47,x:-725,y:100,l:1}]},{t:Item,d:[{i:100,x:-1450,y:-50,t:3,a:1},{i:101,x:-1400,y:-50,t:3,a:1},{i:102,x:-1500,y:-50,t:3,a:1},{i:103,x:-1350,y:-50,t:3,a:1},{i:104,x:-1300,y:-50,t:3,a:1},{i:105,x:-1975,y:225,t:3,a:1},{i:106,x:-1775,y:-125,t:3,a:1},{i:107,x:-1675,y:0,t:3,a:1},{i:108,x:-1725,y:0,t:3,a:1},{i:109,x:-1525,y:-300,t:3,a:1},{i:110,x:-1450,y:-300,t:3,a:1},{i:111,x:-1600,y:-300,t:3,a:1}]},],
        [{t:Player,d:[{i:1,x:-991,y:-220}]},{t:Platform,d:[{i:43,x:-550,y:50,w:775,h:100},{i:44,x:-375,y:-375,w:425,h:325},{i:45,x:675,y:0,w:250,h:275},{i:46,x:825,y:-275,w:100,h:175},{i:47,x:1250,y:0,w:300,h:300},{i:48,x:775,y:275,w:575,h:150},{i:49,x:925,y:75,w:50,h:25,o:1},{i:50,x:925,y:175,w:75,h:25,o:1},{i:51,x:225,y:125,w:450,h:150},{i:52,x:325,y:25,w:250,h:25,o:1},{i:53,x:1700,y:-300,w:150,h:400},{i:54,x:1850,y:75,w:250,h:325},{i:55,x:1625,y:400,w:325,h:175},{i:56,x:1075,y:575,w:650,h:275},{i:57,x:1575,y:475,w:50,h:25,o:1},{i:58,x:1350,y:400,w:150,h:25,o:1},{i:59,x:375,y:575,w:700,h:175},{i:60,x:375,y:400,w:175,h:175},{i:61,x:550,y:500,w:75,h:25,o:1},{i:62,x:775,y:400,w:125,h:25},{i:63,x:-150,y:650,w:525,h:225},{i:64,x:-500,y:550,w:350,h:250},{i:65,x:-950,y:50,w:400,h:200},{i:66,x:-1125,y:-175,w:225,h:300},{i:67,x:-1300,y:-425,w:175,h:350},{i:68,x:-775,y:-100,w:275,h:25,o:1},{i:69,x:100,y:525,w:275,h:25,o:1}]},{t:NPC,d:[{i:3,x:-425,y:0,d:["Let's begin your training!","The access code is $0"],f:true,a:400,h:50,onData:[{"i":4,"f":"getLockCode"}]},{i:6,x:-125,y:0,d:["You can type in JavaScript code in the console to view and manipulate the game world!","Press TAB to switch to the console and type in `scene` (without quotations) to see the data that makes up the current scene!"],f:true,a:400,h:50},{i:10,x:750,y:-50,d:["If you use the mouse to click on a game object, it's variable name appears in the console!","Try clicking on this door to discover how to access it.","You'll need to look up its lock code using the console."],f:true,a:400,h:50},{i:15,x:1175,y:225,d:["You can also change data inside of any game object.","To unlock double-jump, begin by clicking on your player avatar.","Then go to the console, and use the equal sign = to change the value of a variable in the player object."],f:true,a:400,h:50},{i:18,x:536,y:80,d:[],f:false,a:400,h:50},{i:23,x:1418,y:530,d:[],f:false,a:400,h:50},{i:32,x:225,y:475,d:["If you could figure out how to get this guy to calm down, he could help you discover more of the source code!"],f:true,a:400,h:50},{i:34,x:161,y:605,d:["Hello buddy!","To see all of the functions you can call, you need to enable a secret feature.","Try looking into the settings in the `consoleObj`"],f:false,a:400,h:50},{i:36,x:-375,y:500,d:["More puzzles have been designed, but we ran out of time to build it all!","Are you clever enough to enable wall-jumping?"],f:true,a:400,h:50},{i:37,x:1511,y:-45,d:[],f:false,a:400,h:50},{i:42,x:-537,y:-145,d:[],f:false,a:400,h:50}]},{t:Door,d:[{i:4,x:-350,y:-50,l:1},{i:8,x:875,y:-100,l:1}]},{t:Item,d:[{i:26,x:1375,y:375,t:1,a:1},{i:27,x:1425,y:375,t:2,a:1}]},],
        [{t:Player,d:[{i:1,x:-145,y:-445}]},{t:Platform,d:[{i:2,x:-200,y:50,w:575,h:150},{i:3,x:175,y:-950,w:475,h:1000},{i:4,x:-375,y:-400,w:350,h:50},{i:5,x:-75,y:-800,w:275,h:50},{i:6,x:-425,y:-800,w:50,h:450}]},{t:NPC,d:[]},{t:Door,d:[]},{t:Item,d:[]},],
    ],
    level:function(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}