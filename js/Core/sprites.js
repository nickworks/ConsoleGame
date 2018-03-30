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
        
        this.item1=this.load("imgs/item_health.gif");
        this.item2=this.load("imgs/item_ammo.gif");
        this.item3=this.load("imgs/item_coin.gif");
    }
};