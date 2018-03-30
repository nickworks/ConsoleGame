function HUD(){
    
    this.font1=new Font({color:"#FFF",size:19,align:"right",valign:"middle"});
    this.font2=new Font({color:"#FFF",size:19,align:"left",valign:"middle"});
    
    var x1=0;
    const bw=7;//bullet width
    const bm=5;//bullet margin
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
        
        var txt=w.ammo.toString();
        const txtx=bs*c+8;
        const bgw=txtx+this.font2.measure(gfx,txt).width+7;
        const bgx=-(c-b)*bs-2;
        
        let tx=bgx;
        if(w.reloadCooldown>0) tx*=w.reloadCooldown/w.reloadCooldownAmt;
        x1+=(tx-x1)*.3;//slide
        
        gfx.translate(x1,game.height()-18);
        gfx.fillStyle="#000";
        
        gfx.fillRect(0,-13,bgw,26);
        this.font2.apply(gfx);
        
        
        if(b<1&&w.reloaCooldown<=0)txt+=" RELOAD";
        gfx.fillText(txt,txtx,1);
        
        for(var i=0;i<c;i++){
            gfx.fillStyle=(i>=c-b)?"#FFF":"rgba(255,255,255,.25)";
            gfx.fillRect(7+bs*i,-7,bw,14);
        }
        
        gfx.resetTransform();
    }
}