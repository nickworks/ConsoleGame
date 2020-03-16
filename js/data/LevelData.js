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
        [{t:ProximityMine,d:[{i:143,x:-1800,y:100,r:100}]},{t:Portal,d:[{x:550,y:100,n:1,sx:-981,sy:-220},{x:-2575,y:-375,n:3,sx:0,sy:0}]},{t:Platform,d:[{i:145,x:-1000,y:200,w:1650,h:100},{i:146,x:-2150,y:275,w:1225,h:125},{i:147,x:-1700,y:-250,w:600,h:150},{i:148,x:400,y:-250,w:75,h:350},{i:149,x:-175,y:-250,w:75,h:350},{i:150,x:-1000,y:-150,w:300,h:250},{i:151,x:-2175,y:-25,w:175,h:500},{i:152,x:-2000,y:125,w:125,h:25,o:1},{i:153,x:-1825,y:50,w:275,h:25,o:1},{i:154,x:-1625,y:-100,w:75,h:150},{i:155,x:-2425,y:-175,w:250,h:300},{i:156,x:-2075,y:-100,w:250,h:25,o:1},{i:157,x:-700,y:75,w:300,h:25,o:1},{i:158,x:-1775,y:200,w:300,h:100},{i:159,x:-1825,y:-175,w:125,h:25,o:1},{i:160,x:-2000,y:-25,w:75,h:25,o:1},{i:161,x:-1975,y:-175,w:150,h:75},{i:162,x:-575,y:125,w:100,h:75},{i:163,x:-1150,y:-50,w:150,h:25,o:1},{i:164,x:-1050,y:-125,w:50,h:25,o:1},{i:165,x:-1550,y:25,w:350,h:25},{i:166,x:-775,y:-400,w:75,h:250},{i:167,x:-1350,y:-475,w:100,h:125},{i:168,x:-700,y:0,w:75,h:75},{i:169,x:-1250,y:-475,w:550,h:75},{i:170,x:650,y:-75,w:125,h:350},{i:171,x:-100,y:75,w:50,h:25,o:1},{i:172,x:350,y:75,w:50,h:25,o:1},{i:173,x:-25,y:-25,w:350,h:25,o:1},{i:189,x:-2750,y:-275,w:425,h:325},{i:190,x:-2950,y:-725,w:300,h:675}]},{t:Pawn,d:[{i:2,x:-325,y:155,d:["Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the F key to shoot bullets."],f:true,a:800,onSpeak:[{"i":5,"f":"open"}]},{i:3,x:-1675,y:150,d:["Hello, player!","Welcome to the game."],f:true,a:800},{i:73,x:174,y:155,d:["Thanks for being my friend!"],f:false,a:400,onDeath:[{"i":6,"f":"forceOpen"}],s:100},{i:99,x:-900,y:155,d:["If you bring me 10 coins, I'll open this door for you!"],f:true,a:400,onSpeak:[{"i":47,"f":"openIfPlayerControllerHasEnoughCoins","p":{"c":10}}]},{i:0,x:-2425,y:-325,d:[],f:false,a:400}]},{t:Door,d:[{i:5,x:-150,y:100,l:0,onOpen:[{"i":73,"f":"setSight","p":{"amt":300}}]},{i:6,x:425,y:100,l:1},{i:46,x:-1325,y:-350,l:0},{i:47,x:-725,y:100,l:1}]},{t:Item,d:[{i:103,x:-1350,y:-50,t:3},{i:104,x:-1300,y:-50,t:3},{i:106,x:-1775,y:-125,t:3},{i:136,x:-1950,y:225,t:3},{i:137,x:-1950,y:-225,t:3},{i:138,x:-1900,y:-225,t:3},{i:139,x:-1850,y:-225,t:3},{i:140,x:-1000,y:-225,t:3},{i:141,x:-950,y:-225,t:3},{i:142,x:-900,y:-225,t:3}]},{t:Crate,d:[{i:178,x:-1550,y:-25,w:50,h:50},{i:179,x:-2300,y:-250,w:75,h:75},{i:180,x:-1475,y:-25,w:50,h:50},{i:181,x:-1800,y:0,w:50,h:50},{i:182,x:-1850,y:225,w:50,h:50},{i:183,x:-1675,y:-300,w:50,h:50},{i:184,x:-850,y:-200,w:50,h:50},{i:185,x:25,y:-75,w:50,h:50},{i:186,x:175,y:-75,w:50,h:50},{i:187,x:-1700,y:-25,w:75,h:75}]},],
        [{t:Portal,d:[{x:-475,y:450,n:2,sx:-550,sy:-20}]},{t:Platform,d:[{i:72,x:-550,y:50,w:775,h:100},{i:73,x:-375,y:-375,w:425,h:325},{i:74,x:675,y:0,w:250,h:275},{i:75,x:825,y:-275,w:100,h:175},{i:76,x:1250,y:-100,w:300,h:375},{i:77,x:775,y:275,w:575,h:150},{i:78,x:925,y:75,w:50,h:25,o:1},{i:79,x:925,y:175,w:75,h:25,o:1},{i:80,x:225,y:125,w:450,h:150},{i:81,x:325,y:0,w:250,h:25,o:1},{i:82,x:1700,y:-475,w:400,h:550},{i:83,x:1850,y:75,w:250,h:325},{i:84,x:1625,y:400,w:325,h:175},{i:85,x:1075,y:575,w:650,h:275},{i:86,x:1575,y:475,w:50,h:25,o:1},{i:87,x:1350,y:400,w:150,h:25,o:1},{i:88,x:375,y:575,w:700,h:175},{i:89,x:375,y:400,w:175,h:175},{i:90,x:550,y:500,w:75,h:25,o:1},{i:91,x:775,y:400,w:125,h:25},{i:92,x:-150,y:650,w:525,h:225},{i:93,x:-575,y:550,w:425,h:250},{i:94,x:-950,y:50,w:400,h:200},{i:95,x:-1125,y:-175,w:225,h:300},{i:96,x:-1300,y:-425,w:175,h:350},{i:97,x:-775,y:-100,w:275,h:25,o:1},{i:98,x:100,y:525,w:275,h:25,o:1},{i:99,x:100,y:-100,w:100,h:25,o:1},{i:100,x:50,y:-200,w:50,h:150},{i:101,x:50,y:-300,w:50,h:25,o:1},{i:102,x:-700,y:250,w:150,h:450}]},{t:AIController,d:[{i:3,x:-475,y:4,d:["Let's begin your training!","The access code is $0"],f:true,a:400,h:50,onData:[{"i":4,"f":"getLockCode"}]},{i:6,x:-125,y:4,d:["You can type in JavaScript code in the console to view and manipulate the game world!","Press TAB to switch to the console and type in `scene` (without quotations) to see the data that makes up the current scene!"],f:true,a:400,h:50},{i:10,x:750,y:-45,d:["If you use the mouse to click on a game object, it's variable name appears in the console!","Try clicking on this door to discover how to access it.","You'll need to look up its lock code using the console."],f:true,a:400,h:50},{i:15,x:1175,y:230,d:["You can also change data inside of any game object.","To unlock double-jump, begin by clicking on your player avatar.","Then go to the console, and use the equal sign = to change the value of a variable in the player object."],f:true,a:400,h:50},{i:18,x:436,y:80,d:[],f:false,a:400,h:50},{i:23,x:1050,y:530,d:[],f:false,a:400,h:50},{i:32,x:225,y:480,d:["If you could figure out how to get this guy to calm down, he could help you discover more of the source code!"],f:true,a:400,h:50},{i:34,x:204,y:605,d:["Hello buddy!","To see all of the functions you can call, you need to enable a secret feature.","Try looking into the settings in the `game.console`"],f:false,a:400,h:50},{i:36,x:-375,y:505,d:["More puzzles have been designed, but we ran out of time to build it all!","Are you clever enough to enable wall-jumping?"],f:true,a:400,h:50},{i:37,x:1379,y:-145,d:[],f:false,a:400,h:50},{i:71,x:-75,y:-420,d:["To heal yourself, try typing the following into the console:","player.pawn.hp=100"],f:true,a:400,h:50}]},{t:Door,d:[{i:4,x:-350,y:-50,l:1},{i:8,x:875,y:-100,l:1}]},{t:Item,d:[{i:26,x:1375,y:375,t:1,a:1},{i:27,x:1425,y:375,t:2,a:1}]},{t:Crate,d:[{i:0,x:-875,y:0,w:50,h:50},{i:0,x:1700,y:350,w:50,h:50},{i:0,x:1775,y:250,w:50,h:50},{i:0,x:1750,y:300,w:100,h:100}]},],
        [{t:Platform,d:[{i:2,x:-200,y:50,w:575,h:150},{i:3,x:175,y:-950,w:475,h:1000},{i:4,x:-675,y:-400,w:650,h:50},{i:5,x:-125,y:-800,w:325,h:50},{i:6,x:-475,y:-1100,w:50,h:450},{i:7,x:-125,y:-350,w:100,h:275},{i:8,x:-200,y:-800,w:75,h:275},{i:9,x:-1175,y:25,w:975,h:175},{i:10,x:-925,y:-275,w:50,h:25,o:1},{i:11,x:-1150,y:-400,w:225,h:150},{i:12,x:-975,y:-250,w:50,h:275},{i:13,x:-700,y:-400,w:50,h:275},{i:14,x:-425,y:-1100,w:300,h:25,o:1},{i:15,x:-800,y:-1375,w:825,h:75},{i:16,x:-1025,y:-1375,w:250,h:600},{i:17,x:-775,y:-925,w:125,h:25,o:1},{i:18,x:-550,y:-725,w:75,h:25,o:1},{i:19,x:-500,y:-75,w:200,h:100}]},{t:AIController,d:[{i:20,x:-425,y:-125,d:["psssst....","Game.DEVMODE=true"],f:true,a:400,h:50}]},{t:Door,d:[]},{t:Item,d:[]},{t:Crate,d:[{i:0,x:-375,y:-450,w:50,h:50},{i:0,x:-125,y:-450,w:50,h:50},{i:0,x:-575,y:-450,w:50,h:50},{i:0,x:-775,y:-975,w:50,h:50},{i:0,x:100,y:-850,w:50,h:50},{i:0,x:-25,y:-850,w:50,h:50},{i:0,x:25,y:-850,w:50,h:50},{i:0,x:0,y:-900,w:50,h:50},{i:0,x:75,y:-900,w:50,h:50}]},],
        [{t:Platform,d:[{i:231,x:-150,y:325,w:400,h:50},{i:232,x:250,y:-150,w:525,h:850},{i:233,x:200,y:575,w:50,h:100},{i:234,x:-1825,y:-250,w:450,h:475},{i:235,x:-1375,y:100,w:375,h:50},{i:236,x:-925,y:375,w:500,h:400},{i:237,x:-1900,y:325,w:600,h:125},{i:238,x:-1825,y:450,w:450,h:350},{i:239,x:-3175,y:-250,w:1075,h:100},{i:240,x:-2225,y:250,w:125,h:350},{i:241,x:-2700,y:425,w:125,h:1250},{i:242,x:-3225,y:175,w:150,h:150},{i:243,x:-2575,y:500,w:50,h:25,o:1},{i:244,x:-2750,y:500,w:50,h:25,o:1},{i:245,x:-1900,y:800,w:600,h:125},{i:246,x:-2150,y:-150,w:50,h:275},{i:247,x:-2100,y:250,w:50,h:75},{i:248,x:-3175,y:-150,w:50,h:200},{i:249,x:-3200,y:225,w:100,h:350},{i:250,x:-2575,y:1325,w:1475,h:550},{i:251,x:-1850,y:925,w:75,h:300},{i:252,x:-1425,y:925,w:75,h:300},{i:253,x:-1775,y:1125,w:350,h:25,o:1},{i:254,x:-3650,y:-250,w:200,h:575},{i:255,x:-3450,y:225,w:225,h:100},{i:256,x:-3450,y:-250,w:275,h:25,o:1},{i:257,x:-2100,y:-250,w:275,h:25,o:1},{i:258,x:-1150,y:1875,w:775,h:250},{i:259,x:-3700,y:900,w:1000,h:775},{i:260,x:-3575,y:550,w:375,h:25,o:1},{i:261,x:-3775,y:300,w:125,h:25,o:1},{i:262,x:-4675,y:-250,w:1025,h:125},{i:263,x:-5000,y:1200,w:1300,h:325},{i:264,x:-4875,y:825,w:1000,h:50},{i:265,x:-4825,y:875,w:75,h:225},{i:266,x:-4000,y:875,w:75,h:225},{i:267,x:-4750,y:1000,w:750,h:25,o:1},{i:268,x:-4425,y:875,w:100,h:175},{i:269,x:-4800,y:650,w:850,h:175},{i:270,x:-4650,y:600,w:575,h:50},{i:271,x:-4550,y:450,w:100,h:150},{i:272,x:-3025,y:-375,w:575,h:125},{i:273,x:-2750,y:-475,w:125,h:100},{i:274,x:-2625,y:-400,w:50,h:25},{i:275,x:-2800,y:-425,w:50,h:50},{i:276,x:-2875,y:-400,w:75,h:25},{i:277,x:-2450,y:-275,w:125,h:25},{i:278,x:-2450,y:-325,w:50,h:50},{i:279,x:-3075,y:-300,w:50,h:50},{i:280,x:-2725,y:-1525,w:100,h:550},{i:281,x:-2750,y:-975,w:175,h:25,o:1},{i:282,x:-3100,y:-1625,w:1025,h:100},{i:283,x:-425,y:1300,w:900,h:675},{i:284,x:425,y:700,w:525,h:650},{i:285,x:-200,y:725,w:50,h:475},{i:287,x:-150,y:775,w:300,h:75},{i:288,x:100,y:850,w:100,h:350},{i:289,x:-150,y:1100,w:50,h:25,o:1},{i:290,x:0,y:950,w:100,h:25,o:1},{i:292,x:-1150,y:1175,w:775,h:25,o:1},{i:293,x:-375,y:1175,w:25,h:25},{i:295,x:-1350,y:1175,w:200,h:50},{i:297,x:-1350,y:925,w:75,h:25,o:1},{i:298,x:-1275,y:1075,w:100,h:100},{i:299,x:-950,y:775,w:550,h:25,o:1},{i:300,x:-1000,y:1300,w:450,h:125},{i:301,x:-1100,y:1800,w:50,h:25,o:1},{i:302,x:-950,y:1675,w:75,h:200},{i:303,x:-675,y:1675,w:75,h:200},{i:304,x:-875,y:1675,w:200,h:25,o:1},{i:305,x:-475,y:1775,w:50,h:25,o:1},{i:306,x:-1100,y:1525,w:50,h:25,o:1},{i:307,x:-500,y:1500,w:75,h:25,o:1},{i:308,x:-800,y:1550,w:25,h:25},{i:311,x:-425,y:375,w:75,h:25,o:1},{i:312,x:-975,y:375,w:50,h:25,o:1},{i:315,x:-225,y:475,w:475,h:25,o:1},{i:318,x:-2275,y:1025,w:225,h:200},{i:319,x:-2425,y:925,w:275,h:200},{i:320,x:-2575,y:1250,w:150,h:75},{i:321,x:-2575,y:925,w:150,h:25,o:1},{i:322,x:-2275,y:600,w:200,h:25,o:1}]},{t:Door,d:[{i:196,x:-1400,y:225,l:0},{i:197,x:-1825,y:225,l:0},{i:213,x:-1825,y:1225,l:0},{i:214,x:-1400,y:1225,l:0},{i:228,x:-4800,y:1100,l:0},{i:230,x:-3975,y:1100,l:0},{i:286,x:-175,y:1200,l:0},{i:291,x:175,y:1200,l:0},{i:294,x:-375,y:1200,l:0},{i:296,x:-1200,y:1225,l:0}]},{t:Pawn,d:[{i:0,x:-775,y:1625,d:[],f:false,a:400},{i:0,x:-950,y:1100,d:[],f:false,a:400},{i:0,x:50,y:400,d:[],f:false,a:400},{i:0,x:-100,y:275,d:["Hold on!","You might not be ready for this area."],f:true,a:400}]},{t:Crate,d:[{i:313,x:-650,y:325,w:50,h:50},{i:314,x:-575,y:300,w:75,h:75}]},{t:Portal,d:[{x:150,y:225,n:0,sx:-2575,sy:-375}]},],
    ],
    level(n){
        var d=this.data[n];
        if(!d)return this.empty();
        return this.deserialize(d);
    }
}