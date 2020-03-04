const LevelData={
    serialize(){

        // TODO:
        // During serialization, objects are grouped together for
        // a lower filesize. [{t:Door,d:[]},{t:Crate,d:[]}]

        // During deserialization, objects are put into scene.objs
        // in order, so the first objects deserialized are at the
        // back of the scene.

        // We need to find a solution to preserve
        // the relative depth of objects...

        // we could serialize them in order, but we
        // can't deserialize them in the correct order

        // We'll need to store their relative depths.
        // During deserialization, we then will order them by depth.


        let res="[";

        // this function takes a Type and an Array of objects, presumably that type.
        // It then serializes them into a JSON object by calling each of the objects' 
        // serialize() functions
        const f=(t,a)=>{
            res+="{t:"+t+",d:[";
            let idx1=0;
            a.forEach(i=>{

                if(i.constructor.name=="Pawn"){
                    if(i.mind && i.mind.constructor.name=="AIController"){
                        game.console.log("pawn was found to be an AI");
                        i = i.mind; // serialize the AIController
                    } else {
                        return; // if the Pawn isn't controlled by an AI, don't serialize it
                    }
                }
                else if(!i.serialize) return; // we ignore objects that don't have a serialize() function

                if(idx1++>0)res+=",";
                res+="{";
                const r=i.serialize();
                let idx2=0;
                for(var p in r){
                    if(idx2++>0)res+=",";
                    res+=p+":"+JSON.stringify(r[p]);
                }
                res+="}";
            });
            res+="]},";
        };

        const all = scene.objs.allByType(); // to save on space, we group the objects together by type
        for(var i in all){
            f(i,all[i]);
        }
        res+="]";
        return res;
    },
    deserialize(d){
        const objs=[];
        d.forEach(t=>{ // for each type
            t.d.forEach(o=>{ // for each object

                if(t.t == Pawn)t.t=AIController;
                const j=new t.t(o); // spawn the object

                switch(t.t){ // store it in the correct spot
                    case PlayerController:
                    case AIController:
                        objs.push(j.pawn);
                        break;
                    default:
                        objs.push(j);
                        break;
                }
            });
        });
        return objs;
    },
    empty(){
        return this.deserialize([{t:PlayerController,d:[{x:0,y:0}]}]);
    },
    data:[
        [{t:ProximityMine,d:[{x:-1800,y:100,r:100}]},{t:Portal,d:[{x:550,y:100,n:1,sx:-981,sy:-220}]},{t:Platform,d:[{i:143,x:-1000,y:200,w:1650,h:100},{i:144,x:-2150,y:275,w:1225,h:125},{i:145,x:-1700,y:-250,w:600,h:150},{i:146,x:400,y:-250,w:75,h:350},{i:147,x:-175,y:-250,w:75,h:350},{i:148,x:-1000,y:-150,w:300,h:250},{i:149,x:-2175,y:-25,w:175,h:500},{i:150,x:-2000,y:125,w:125,h:25,o:1},{i:151,x:-1825,y:50,w:275,h:25,o:1},{i:152,x:-1625,y:-100,w:75,h:150},{i:153,x:-2175,y:-525,w:100,h:500},{i:154,x:-2075,y:-100,w:250,h:25,o:1},{i:155,x:-700,y:75,w:300,h:25,o:1},{i:156,x:-1775,y:200,w:300,h:100},{i:157,x:-1825,y:-175,w:125,h:25,o:1},{i:158,x:-2000,y:-25,w:75,h:25,o:1},{i:159,x:-1975,y:-175,w:150,h:75},{i:160,x:-575,y:125,w:100,h:75},{i:161,x:-1150,y:-50,w:150,h:25,o:1},{i:162,x:-1050,y:-125,w:50,h:25,o:1},{i:163,x:-1550,y:25,w:350,h:25},{i:164,x:-775,y:-400,w:75,h:250},{i:165,x:-1350,y:-475,w:100,h:125},{i:166,x:-700,y:0,w:75,h:75},{i:167,x:-1250,y:-475,w:550,h:75},{i:168,x:650,y:-75,w:125,h:350},{i:169,x:-100,y:75,w:50,h:25,o:1},{i:170,x:350,y:75,w:50,h:25,o:1},{i:171,x:-25,y:-25,w:350,h:25,o:1}]},{t:AIController,d:[{i:2,x:-325,y:155,d:["Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the F key to shoot bullets."],f:true,a:800,h:20,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-1575,y:155,d:["Hello, player!","Welcome to the game."],f:true,a:800,h:50},{i:73,x:150,y:150,d:["Thanks for being my friend!"],f:false,a:400,h:50,onDeath:[{"i":6,"f":"forceOpen"}],s:100},{i:99,x:-900,y:155,d:["If you bring me 10 coins, I'll open this door for you!"],f:true,a:400,h:50,onSpeak:[{"i":47,"f":"openIfPlayerControllerHasEnoughCoins","p":{"c":10}}]}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":73,"f":"setSight","p":{"amt":300}}]},{i:6,x:425,y:100,l:1},{i:46,x:-1325,y:-350,l:0},{i:47,x:-725,y:100,l:1}]},{t:Item,d:[{i:103,x:-1350,y:-50,t:3,a:1},{i:104,x:-1300,y:-50,t:3,a:1},{i:106,x:-1775,y:-125,t:3,a:1},{i:136,x:-1950,y:225,t:3,a:1},{i:137,x:-1950,y:-225,t:3,a:1},{i:138,x:-1900,y:-225,t:3,a:1},{i:139,x:-1850,y:-225,t:3,a:1},{i:140,x:-1000,y:-225,t:3,a:1},{i:141,x:-950,y:-225,t:3,a:1},{i:142,x:-900,y:-225,t:3,a:1}]},{t:Crate,d:[{i:0,  x:-1550,y:-25,w:50,h:50},{i:0,x:-1525,y:-100,w:75,h:75},{i:0,x:-1475,y:-25,w:50,h:50},{i:0,x:-1800,y:0,w:50,h:50},{i:0,x:-1850,y:225,w:50,h:50},{i:0,x:-1675,y:-300,w:50,h:50},{i:0,x:-850,y:-200,w:50,h:50},{i:0,x:25,y:-75,w:50,h:50},{i:0,x:175,y:-75,w:50,h:50},{i:0,x:-1700,y:-25,w:75,h:75}]},],
        [{t:Portal,d:[{x:-475,y:450,n:2,sx:-550,sy:-20}]},{t:Platform,d:[{i:72,x:-550,y:50,w:775,h:100},{i:73,x:-375,y:-375,w:425,h:325},{i:74,x:675,y:0,w:250,h:275},{i:75,x:825,y:-275,w:100,h:175},{i:76,x:1250,y:-100,w:300,h:375},{i:77,x:775,y:275,w:575,h:150},{i:78,x:925,y:75,w:50,h:25,o:1},{i:79,x:925,y:175,w:75,h:25,o:1},{i:80,x:225,y:125,w:450,h:150},{i:81,x:325,y:0,w:250,h:25,o:1},{i:82,x:1700,y:-475,w:400,h:550},{i:83,x:1850,y:75,w:250,h:325},{i:84,x:1625,y:400,w:325,h:175},{i:85,x:1075,y:575,w:650,h:275},{i:86,x:1575,y:475,w:50,h:25,o:1},{i:87,x:1350,y:400,w:150,h:25,o:1},{i:88,x:375,y:575,w:700,h:175},{i:89,x:375,y:400,w:175,h:175},{i:90,x:550,y:500,w:75,h:25,o:1},{i:91,x:775,y:400,w:125,h:25},{i:92,x:-150,y:650,w:525,h:225},{i:93,x:-575,y:550,w:425,h:250},{i:94,x:-950,y:50,w:400,h:200},{i:95,x:-1125,y:-175,w:225,h:300},{i:96,x:-1300,y:-425,w:175,h:350},{i:97,x:-775,y:-100,w:275,h:25,o:1},{i:98,x:100,y:525,w:275,h:25,o:1},{i:99,x:100,y:-100,w:100,h:25,o:1},{i:100,x:50,y:-200,w:50,h:150},{i:101,x:50,y:-300,w:50,h:25,o:1},{i:102,x:-700,y:250,w:150,h:450}]},{t:AIController,d:[{i:3,x:-475,y:4,d:["Let's begin your training!","The access code is $0"],f:true,a:400,h:50,onData:[{"i":4,"f":"getLockCode"}]},{i:6,x:-125,y:4,d:["You can type in JavaScript code in the console to view and manipulate the game world!","Press TAB to switch to the console and type in `scene` (without quotations) to see the data that makes up the current scene!"],f:true,a:400,h:50},{i:10,x:750,y:-45,d:["If you use the mouse to click on a game object, it's variable name appears in the console!","Try clicking on this door to discover how to access it.","You'll need to look up its lock code using the console."],f:true,a:400,h:50},{i:15,x:1175,y:230,d:["You can also change data inside of any game object.","To unlock double-jump, begin by clicking on your player avatar.","Then go to the console, and use the equal sign = to change the value of a variable in the player object."],f:true,a:400,h:50},{i:18,x:436,y:80,d:[],f:false,a:400,h:50},{i:23,x:1050,y:530,d:[],f:false,a:400,h:50},{i:32,x:225,y:480,d:["If you could figure out how to get this guy to calm down, he could help you discover more of the source code!"],f:true,a:400,h:50},{i:34,x:204,y:605,d:["Hello buddy!","To see all of the functions you can call, you need to enable a secret feature.","Try looking into the settings in the `game.console`"],f:false,a:400,h:50},{i:36,x:-375,y:505,d:["More puzzles have been designed, but we ran out of time to build it all!","Are you clever enough to enable wall-jumping?"],f:true,a:400,h:50},{i:37,x:1379,y:-145,d:[],f:false,a:400,h:50},{i:71,x:-75,y:-420,d:["To heal yourself, try typing the following into the console:","player.pawn.hp=100"],f:true,a:400,h:50}]},{t:Door,d:[{i:4,x:-350,y:-50,l:1},{i:8,x:875,y:-100,l:1}]},{t:Item,d:[{i:26,x:1375,y:375,t:1,a:1},{i:27,x:1425,y:375,t:2,a:1}]},{t:Crate,d:[{i:0,x:-875,y:0,w:50,h:50},{i:0,x:1700,y:350,w:50,h:50},{i:0,x:1775,y:250,w:50,h:50},{i:0,x:1750,y:300,w:100,h:100}]},],
        [{t:Platform,d:[{i:2,x:-200,y:50,w:575,h:150},{i:3,x:175,y:-950,w:475,h:1000},{i:4,x:-675,y:-400,w:650,h:50},{i:5,x:-125,y:-800,w:325,h:50},{i:6,x:-475,y:-1100,w:50,h:450},{i:7,x:-125,y:-350,w:100,h:275},{i:8,x:-200,y:-800,w:75,h:275},{i:9,x:-1175,y:25,w:975,h:175},{i:10,x:-925,y:-275,w:50,h:25,o:1},{i:11,x:-1150,y:-400,w:225,h:150},{i:12,x:-975,y:-250,w:50,h:275},{i:13,x:-700,y:-400,w:50,h:275},{i:14,x:-425,y:-1100,w:300,h:25,o:1},{i:15,x:-800,y:-1375,w:825,h:75},{i:16,x:-1025,y:-1375,w:250,h:600},{i:17,x:-775,y:-925,w:125,h:25,o:1},{i:18,x:-550,y:-725,w:75,h:25,o:1},{i:19,x:-500,y:-75,w:200,h:100}]},{t:AIController,d:[{i:20,x:-425,y:-125,d:["psssst....","player.weapon(new Weapon({t:5}))"],f:true,a:400,h:50}]},{t:Door,d:[]},{t:Item,d:[]},{t:Crate,d:[{i:0,x:-375,y:-450,w:50,h:50},{i:0,x:-125,y:-450,w:50,h:50},{i:0,x:-575,y:-450,w:50,h:50},{i:0,x:-775,y:-975,w:50,h:50},{i:0,x:100,y:-850,w:50,h:50},{i:0,x:-25,y:-850,w:50,h:50},{i:0,x:25,y:-850,w:50,h:50},{i:0,x:0,y:-900,w:50,h:50},{i:0,x:75,y:-900,w:50,h:50}]},],
    ],
    level(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}