const sprites={
    load:(url, onLoad)=>{
        const img=new Image();
        img.src=url;
        if(onLoad)img.addEventListener("load",()=>onLoad(img));
        return img;
    },
    
    init:function(){
        
        const pattern=(i)=>{return gfx.createPattern(i,'repeat');};
        
        this.load("imgs/tiles.gif",(i)=>{
            this.tiles=pattern(i);
        });
        this.load("imgs/tiles2.png",(i)=>{
            this.tiles2=pattern(i);
        });
        
        this.item1=this.load("imgs/item_health.gif");
        this.item2=this.load("imgs/item_ammo.gif");
        this.item3=this.load("imgs/item_coin.gif");
        this.bullet=this.load("imgs/bullet.gif");
        this.gun1=this.load("imgs/gun1.gif");
        this.gun2=this.load("imgs/gun2.gif");
        this.gun3=this.load("imgs/gun3.gif");
        this.gun4=this.load("imgs/gun4.gif");
        this.gun5=this.load("imgs/gun5.gif");

        this.hudGun1=this.load("imgs/hud-gun1.gif");
        this.hudGun2=this.load("imgs/hud-gun2.gif");
        this.hudGun3=this.load("imgs/hud-gun3.gif");
        this.hudGun4=this.load("imgs/hud-gun4.gif");
        this.hudGun5=this.load("imgs/hud-gun5.gif");

        this.projectile=this.load("imgs/projectile.gif");
        this.input=this.load("imgs/input.png");
        this.door0=this.load("imgs/door-dark.gif");
        this.door1=this.load("imgs/door.gif");
        this.door2=this.load("imgs/door-locked.gif");
        this.playerR=this.load("imgs/player.gif");
        this.playerL=this.load("imgs/player2.gif");
        this.npcR=this.load("imgs/npc.gif");
        this.npcL=this.load("imgs/npc2.gif");
        this.enemyR=this.load("imgs/enemy.gif");
        this.enemyL=this.load("imgs/enemy2.gif");
        this.crate=this.load("imgs/crate.gif");
    }
};