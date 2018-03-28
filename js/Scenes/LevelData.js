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
    level:function(n){
        if(n==0)return this.level1();  
    },
    level1:function(){
        const d=[{t:Player,d:[{x:-876,y:175}]},{t:Goal,d:[{x:100,y:100}]},{t:Platform,d:[{x:-1000,y:200,w:1325,h:100},{x:-1000,y:-100,w:1325,h:75},{x:-1000,y:-25,w:50,h:225},{x:275,y:-25,w:50,h:225},{x:-175,y:-25,w:75,h:125},{x:-525,y:100,w:150,h:100}]},{t:NPC,d:[{x:-200,y:175,d:["Hello, player!","Welcome to the game.","Listen, on the other side of this door there's an enemy you need to defeat.","Don't worry! You can use the SPACEBAR to shoot bullets.","Here... let me open the door for you."],f:true,a:800,onSpeak:[{"i":4,"f":"open"}]},{x:-700,y:175,d:["Meow"],f:true,a:800}]},{t:Door,d:[{x:-150,y:100,onClose:[{"i":3,"f":"jump"}]}]},];
        return this.deserialize(d);
    }
}