function HUD(){
    
    this.font=new Font({color:"#FFF",size:19,align:"left",valign:"middle"});
    
    var x1=0;
    const bw=7;//bullet width
    const bm=5;//bullet margin
    const bs=bw+bm;//bullet spread
      
    this.update=function(dt){
        
    };
    this.draw=function(gfx){
        this.drawAmmo(gfx);
        this.drawHealth(gfx);
    };
    this.drawAmmo=function(gfx){
        const w=scene.player.pawn.weapon;//weapon
        const b=w.clip;//loaded bullets
        const c=w.clipMax;//clip size
        
        var txt=w.ammo.toString();
        const txtx=bs*c+8;
        const bgw=txtx+this.font.measure(gfx,txt).width+7;
        const bgx=-(c-b)*bs-2;
        
        let tx=bgx*w.getReloadProgress();
        x1+=(tx-x1)*.3;//slide
        
        gfx.translate(x1,game.height()-35);
        gfx.fillStyle="#000";
        gfx.fillRect(0,-13,bgw,26);
        this.font.apply(gfx);
        
        if(b<1&&w.reloadCooldown<=0)txt+=" RELOAD";
        gfx.fillText(txt,txtx,1);
        
        for(var i=0;i<c;i++){
            gfx.globalAlpha=(i>=c-b)?1:.25;
            gfx.drawImage(sprites.bullet,6+bs*i,-7);
            gfx.globalAlpha=1;
        }
        
        gfx.resetTransform();
    };
    this.drawHealth=function(gfx){
        
        const w=200;
        const h=18;
        const m=5;
        let p=scene.player.hp/100;
        if(p<0)p=0;
        if(p>100)p=100;
        gfx.translate(0,game.height()-20);
        gfx.fillStyle="#000";
        gfx.fillRect(0,0,w,h);
        
        gfx.fillStyle="#FFF";
        gfx.fillRect(m,m,(w-2*m)*p,h-2*m);
        gfx.resetTransform();
    };
}