const LevelData={
    deserialize:function(d){
        const objs={
            player:null,
            goal:null,
            platforms:[],
            npcs:[],
            doors:[],
            items:[],
            crates:[],
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
                    case Crate:objs.crates.push(j);break;
                }
            })
        });
        return objs;
    },
    empty:function(){
        return this.deserialize([{t:Player,d:[{x:0,y:0}]}]);
    },
    data:[
        [{t:Player,d:[{i:1,x:-1250,y:225}]},{t:Goal,d:[{x:550,y:100,n:1}]},{t:Platform,d:[{i:107,x:-1000,y:200,w:1650,h:100},{i:108,x:-2150,y:275,w:1225,h:125},{i:109,x:-1700,y:-250,w:600,h:150},{i:110,x:400,y:-250,w:75,h:350},{i:111,x:-175,y:-250,w:75,h:350},{i:112,x:-1000,y:-150,w:300,h:250},{i:113,x:-2175,y:-25,w:175,h:500},{i:114,x:-2000,y:125,w:125,h:25,o:1},{i:115,x:-1825,y:50,w:275,h:25,o:1},{i:116,x:-1625,y:-100,w:75,h:150},{i:117,x:-2175,y:-525,w:100,h:500},{i:118,x:-2075,y:-100,w:250,h:25,o:1},{i:119,x:-700,y:75,w:300,h:25,o:1},{i:120,x:-1775,y:200,w:300,h:100},{i:121,x:-1825,y:-175,w:125,h:25,o:1},{i:122,x:-2000,y:-25,w:75,h:25,o:1},{i:123,x:-1975,y:-175,w:150,h:75},{i:124,x:-575,y:125,w:100,h:75},{i:125,x:-1150,y:-50,w:150,h:25,o:1},{i:126,x:-1050,y:-125,w:50,h:25,o:1},{i:127,x:-1550,y:25,w:350,h:25},{i:128,x:-775,y:-400,w:75,h:250},{i:129,x:-1350,y:-475,w:100,h:125},{i:130,x:-700,y:0,w:75,h:75},{i:131,x:-1250,y:-475,w:550,h:75},{i:132,x:650,y:-75,w:125,h:350},{i:133,x:-100,y:75,w:50,h:25,o:1},{i:134,x:350,y:75,w:50,h:25,o:1},{i:135,x:-25,y:-25,w:350,h:25,o:1}]},{t:NPC,d:[{i:2,x:-325,y:155,d:["Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the F key to shoot bullets."],f:true,a:800,h:20,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-1575,y:155,d:["Hello, player!","Welcome to the game."],f:true,a:800,h:50},{i:73,x:125,y:150,d:["Thanks for being my friend!"],f:false,a:400,h:50,onDeath:[{"i":6,"f":"forceOpen"}],s:100},{i:99,x:-900,y:155,d:["If you bring me 10 coins, I'll open this door for you!"],f:true,a:400,h:50,onSpeak:[{"i":47,"f":"openIfPlayerHasEnoughCoins","p":{"c":10}}]}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":73,"f":"setSight","p":{"amt":300}}]},{i:6,x:425,y:100,l:1},{i:46,x:-1325,y:-350,l:0},{i:47,x:-725,y:100,l:1}]},{t:Item,d:[{i:103,x:-1350,y:-50,t:3,a:1},{i:104,x:-1300,y:-50,t:3,a:1},{i:106,x:-1775,y:-125,t:3,a:1}]},{t:Crate,d:[{i:0,x:-1550,y:-25,w:50,h:50},{i:0,x:-1525,y:-100,w:75,h:75},{i:0,x:-1475,y:-25,w:50,h:50},{i:0,x:-1700,y:-25,w:75,h:25},{i:0,x:-1800,y:0,w:50,h:50},{i:0,x:-1850,y:225,w:50,h:50},{i:0,x:-1675,y:-300,w:50,h:50},{i:0,x:-850,y:-200,w:50,h:50},{i:0,x:25,y:-75,w:50,h:50},{i:0,x:175,y:-75,w:50,h:50}]},],
        [{t:Player,d:[{i:1,x:-981,y:-220}]},{t:Goal,d:[{x:-475,y:450,n:2}]},{t:Platform,d:[{i:72,x:-550,y:50,w:775,h:100},{i:73,x:-375,y:-375,w:425,h:325},{i:74,x:675,y:0,w:250,h:275},{i:75,x:825,y:-275,w:100,h:175},{i:76,x:1250,y:-100,w:300,h:375},{i:77,x:775,y:275,w:575,h:150},{i:78,x:925,y:75,w:50,h:25,o:1},{i:79,x:925,y:175,w:75,h:25,o:1},{i:80,x:225,y:125,w:450,h:150},{i:81,x:325,y:0,w:250,h:25,o:1},{i:82,x:1700,y:-475,w:400,h:550},{i:83,x:1850,y:75,w:250,h:325},{i:84,x:1625,y:400,w:325,h:175},{i:85,x:1075,y:575,w:650,h:275},{i:86,x:1575,y:475,w:50,h:25,o:1},{i:87,x:1350,y:400,w:150,h:25,o:1},{i:88,x:375,y:575,w:700,h:175},{i:89,x:375,y:400,w:175,h:175},{i:90,x:550,y:500,w:75,h:25,o:1},{i:91,x:775,y:400,w:125,h:25},{i:92,x:-150,y:650,w:525,h:225},{i:93,x:-575,y:550,w:425,h:250},{i:94,x:-950,y:50,w:400,h:200},{i:95,x:-1125,y:-175,w:225,h:300},{i:96,x:-1300,y:-425,w:175,h:350},{i:97,x:-775,y:-100,w:275,h:25,o:1},{i:98,x:100,y:525,w:275,h:25,o:1},{i:99,x:100,y:-100,w:100,h:25,o:1},{i:100,x:50,y:-200,w:50,h:150},{i:101,x:50,y:-300,w:50,h:25,o:1},{i:102,x:-700,y:250,w:150,h:450}]},{t:NPC,d:[{i:3,x:-475,y:4,d:["Let's begin your training!","The access code is $0"],f:true,a:400,h:50,onData:[{"i":4,"f":"getLockCode"}]},{i:6,x:-125,y:4,d:["You can type in JavaScript code in the console to view and manipulate the game world!","Press TAB to switch to the console and type in `scene` (without quotations) to see the data that makes up the current scene!"],f:true,a:400,h:50},{i:10,x:750,y:-45,d:["If you use the mouse to click on a game object, it's variable name appears in the console!","Try clicking on this door to discover how to access it.","You'll need to look up its lock code using the console."],f:true,a:400,h:50},{i:15,x:1175,y:230,d:["You can also change data inside of any game object.","To unlock double-jump, begin by clicking on your player avatar.","Then go to the console, and use the equal sign = to change the value of a variable in the player object."],f:true,a:400,h:50},{i:18,x:436,y:80,d:[],f:false,a:400,h:50},{i:23,x:1050,y:530,d:[],f:false,a:400,h:50},{i:32,x:225,y:480,d:["If you could figure out how to get this guy to calm down, he could help you discover more of the source code!"],f:true,a:400,h:50},{i:34,x:204,y:605,d:["Hello buddy!","To see all of the functions you can call, you need to enable a secret feature.","Try looking into the settings in the `consoleObj`"],f:false,a:400,h:50},{i:36,x:-375,y:505,d:["More puzzles have been designed, but we ran out of time to build it all!","Are you clever enough to enable wall-jumping?"],f:true,a:400,h:50},{i:37,x:1379,y:-145,d:[],f:false,a:400,h:50},{i:71,x:-75,y:-420,d:["To heal yourself, try typing the following into the console:","scene.player.hp=100"],f:true,a:400,h:50}]},{t:Door,d:[{i:4,x:-350,y:-50,l:1},{i:8,x:875,y:-100,l:1}]},{t:Item,d:[{i:26,x:1375,y:375,t:1,a:1},{i:27,x:1425,y:375,t:2,a:1}]},{t:Crate,d:[{i:0,x:-875,y:0,w:50,h:50},{i:0,x:1700,y:350,w:50,h:50},{i:0,x:1775,y:250,w:50,h:50},{i:0,x:1750,y:300,w:100,h:100}]},],
        [{t:Player,d:[{i:1,x:-550,y:-25}]},{t:Platform,d:[{i:2,x:-200,y:50,w:575,h:150},{i:3,x:175,y:-950,w:475,h:1000},{i:4,x:-675,y:-400,w:650,h:50},{i:5,x:-125,y:-800,w:325,h:50},{i:6,x:-475,y:-1100,w:50,h:450},{i:7,x:-125,y:-350,w:100,h:275},{i:8,x:-200,y:-800,w:75,h:275},{i:9,x:-1175,y:25,w:975,h:175},{i:10,x:-925,y:-275,w:50,h:25,o:1},{i:11,x:-1150,y:-400,w:225,h:150},{i:12,x:-975,y:-250,w:50,h:275},{i:13,x:-700,y:-400,w:50,h:275},{i:14,x:-425,y:-1100,w:300,h:25,o:1},{i:15,x:-800,y:-1375,w:825,h:75},{i:16,x:-1025,y:-1375,w:250,h:600},{i:17,x:-775,y:-925,w:125,h:25,o:1},{i:18,x:-550,y:-725,w:75,h:25,o:1},{i:19,x:-525,y:-100,w:200,h:25,o:1}]},{t:NPC,d:[]},{t:Door,d:[]},{t:Item,d:[]},{t:Crate,d:[{i:0,x:-375,y:-450,w:50,h:50},{i:0,x:-125,y:-450,w:50,h:50},{i:0,x:-575,y:-450,w:50,h:50},{i:0,x:-775,y:-975,w:50,h:50},{i:0,x:100,y:-850,w:50,h:50},{i:0,x:-25,y:-850,w:50,h:50},{i:0,x:25,y:-850,w:50,h:50},{i:0,x:0,y:-900,w:50,h:50},{i:0,x:75,y:-900,w:50,h:50}]},]
    ],
    level:function(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}