function HUD(){
    
    this.font1=new Font({color:"#FFF",size:19,align:"right",valign:"middle"});
    this.font2=new Font({color:"#FFF",size:19,align:"left",valign:"middle"});
    
    var x1=0;
    const bw=7;//bullet width
    const bm=4;//bullet margin
    const bs=bw+bm;//bullet spread
    
    
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        this.drawAmmo(gfx);
    };
    this.drawAmmo=function(gfx){
        const w=scene.player.pawn.weapon;//weapon
        const b=w.clip;//loaded bullets
        const c=w.clipAmt;//clip size
        
        const bgw=bs*c+8;
        const bgx=-(c-b)*bs;
        
        let tx=bgx;
        if(w.reloadCooldown>0) tx*=w.reloadCooldown/w.reloadCooldownAmt;
        x1+=(tx-x1)*.3;//slide
        
        gfx.translate(x1,game.height()-18);
        gfx.fillStyle="#000";
        
        gfx.fillRect(0,-13,bgw,26);
        this.font2.apply(gfx);
        var txt=w.ammo.toString();
        if(b<1&&w.reloaCooldown<=0)txt+=" RELOAD";
        gfx.fillText(txt,bgw+5,1);
        
        for(var i=0;i<c;i++){
            //gfx.fillStyle=(i<b)?"#FFF":"rgba(255,255,255,.25)";
            if(i>=c-b)gfx.fillRect(5+bs*i,-7,bw,14);
        }
        
        gfx.resetTransform();
    }
}