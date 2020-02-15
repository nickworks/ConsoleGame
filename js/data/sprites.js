const sprites={
    load:(url, onLoad)=>{
        const img=new Image();
        img.src=url;
        if(onLoad)img.addEventListener("load",()=>onLoad(img));
        return img;
    },
    
    init:function(gfx){
        
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
        this.gun=this.load("imgs/gun.gif");
        this.projectile=this.load("imgs/projectile.gif");
        this.input=this.load("imgs/input.png");
        this.door1=this.load("imgs/door.gif");
        this.door2=this.load("imgs/door-locked.gif");
        this.playerR=this.load("imgs/player.gif");
        this.playerL=this.load("imgs/player2.gif");
        this.enemyR=this.load("imgs/enemy.gif");
        this.enemyL=this.load("imgs/enemy2.gif");
        this.crate=this.load("imgs/crate.gif");
    }
};