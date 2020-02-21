class HUD extends Modal {

    constructor(){
        super();
        this.blocksSceneInput = false;
        this.font=new Font({color:"#FFF",size:17,align:"center",valign:"middle"});
    }

    attach(pawn){
        // attach this HUD to a pawn
        this.pawn=pawn;
    }
    update(){
        
    }
    draw(gfx){
        this.drawAmmo(gfx);
        this.drawHealth(gfx);
    }
    drawAmmo(gfx){
        
        // position near bottom of screen:
        const y=game.height()-35;

        // calculate size of ammo txt box:
        let txt="";
        if(this.pawn)txt=this.pawn.weapon.ammo.toString(); // text string
        let width = this.font.measure(gfx,txt).width + 12;
        if(width < 35) width = 35;
        const height=26;
        
        // draw the bullets:
        this.drawBullets(gfx, width, y, height);

        // draw the ammo txt box:
        gfx.fillStyle="#000";
        gfx.fillRect(0,y-height/2,width,height);

        this.font.apply(gfx);
        gfx.fillText(txt,width/2,1+y);

    }
    drawBullets(gfx, x, y, height){

        if(!this.pawn) return;
        const w=this.pawn.weapon;//weapon
        const bw=7;//bullet width
        const bm=4;//bullet margin
        const sm=4;//side margins
        const bs=bw+bm;//bullet spread
        
        const b=w.clip;//loaded bullets
        const c=w.clipMax;//clip size
        
        // calculate background width and x position:
        const bgw=bs*c+sm*2;

        gfx.fillStyle="rgba(10,10,20,.25)";
        gfx.fillRect(x,y-height/2,bgw,height);

        const bulletsMissing = (c-b);
        let bgx = -bulletsMissing * bs;
        if(bgx < 0) bgx += 2-sm;
        
        x=x+bgx*w.getReloadProgress(); // calculate background position
        Matrix.push();
        Matrix.translate(x,y);
        gfx.fillStyle="rgb(75,75,75)";
        gfx.fillRect(0,-height/2,bgw,height);
        

        for(var i=0;i<c;i++){
            gfx.globalAlpha=(i>=c-b)?1:.25;
            gfx.drawImage(sprites.bullet,sm+bs*i,-7);
            gfx.globalAlpha=1;
        }
        
        Matrix.pop();
    }
    drawHealth(gfx){
        
        const w=200;
        const h=18;
        const m=5;
        let p=this.pawn.hp/100;
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