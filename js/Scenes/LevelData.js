const LevelData={
    deserialize:function(d){
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
    },
    level:function(n){
        if(n==0)return this.level1();  
    },
    level1:function(){
        //DESERIALIZE DATA:
        const d=[{t:Player,d:[{i:124,x:-225,y:175,},]},{t:Platform,d:[{x:-1000,y:200,w:1325,h:100,},{x:-1000,y:-100,w:1325,h:75,},{x:-1000,y:-25,w:50,h:225,},{x:275,y:-25,w:50,h:225,},{x:-175,y:-25,w:75,h:125,},{x:-525,y:100,w:150,h:100,},]},{t:NPC,d:[{i:100,onSpeak:[{i:99,f:"open"},{i:100,f:"jump"}],x:-200,y:175,d:["Hello, player!","Welcome to the game.","Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets.","Here... let me open the door for you."],f:true,},]},{t:Door,d:[{i:99,x:-150,y:100,},]},];
        const objs=this.deserialize(d);

        //LEVEL SCRIPTING:
        //objs.npcs[0].callbacks.onSpeak=()=>{objs.doors[0].open();};
        
        //FIX ALL CALLBACKS:
        //get an item by its id
        //turn onSpeak:{i:999,f:open} into function(){}
        
        
        return objs;
    }
}