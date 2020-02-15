class HUD {
    constructor(){
        this.font=new Font({color:"#FFF",size:19,align:"left",valign:"middle"});
    }
    update(dt){
        
    }
    draw(gfx){
        this.drawAmmo(gfx);
        this.drawHealth(gfx);
    }
    drawAmmo(gfx){
        var x1=0;
        const bw=7;//bullet width
        const bm=5;//bullet margin
        const bs=bw+bm;//bullet spread
        const w=scene.player.pawn.weapon;//weapon
        const b=w.clip;//loaded bullets
        const c=w.clipMax;//clip size
        
        var txt=w.ammo.toString();
        const txtx=bs*c+8;
        const bgw=txtx+this.font.measure(gfx,txt).width+7;
        const bgx=-(c-b)*bs-2;
        
        var y=game.height()-35;
        
        gfx.fillStyle="rgba(10,10,20,.25)";
        gfx.fillRect(-2,y-13,bgw,26);
        
        let tx=bgx*w.getReloadProgress();
        x1+=(tx-x1)*.3;//slide
        Matrix.push();
        Matrix.translate(x1,y);
        gfx.fillStyle="rgb(50,50,100)";
        gfx.fillRect(0,-13,bgw,26);
        this.font.apply(gfx);
        gfx.fillText(txt,txtx,1);
        for(var i=0;i<c;i++){
            gfx.globalAlpha=(i>=c-b)?1:.25;
            gfx.drawImage(sprites.bullet,6+bs*i,-7);
            gfx.globalAlpha=1;
        }
        
        Matrix.pop();
    }
    drawHealth(gfx){
        
        const w=200;
        const h=18;
        const m=5;
        let p=scene.player.hp/100;
        if(p<0)p=0;
        if(p>100)p=100;
        Matrix.push();
        Matrix.translate(0,game.height()-20);
        gfx.fillStyle="rgba(10,20,10,.25)";
        gfx.fillRect(0,0,w,h);
        
        gfx.fillStyle="rgb(50,100,50)";
        gfx.fillRect(0,0,w*p,h);
        Matrix.pop();
    }
}