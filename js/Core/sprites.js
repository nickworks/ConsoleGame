const sprites={
    load:(url, onLoad)=>{
        const img=new Image();
        img.src=url;
        img.addEventListener("load",()=>onLoad(img));
        return img;
    },
    
    init:function(gfx){
        
        const pattern=(i)=>{return gfx.createPattern(i,'repeat');};
        
        this.load("imgs/tiles.gif",(i)=>{
            this.tiles=pattern(i);
        });
    }
};