class HUD extends Modal {

    constructor(){
        super();
        
        this.blocksSceneInput = false;
        this.ammoPercent=1;
        
        this.fontWeaponAmmo=new Font({color:"#FFF",size:17,align:"right",valign:"middle"});
        this.fontWeaponTitle=new Font({color:"#FFF",size:12,align:"center",valign:"middle"});
        this.fontCoins=new Font({color:"#FFF",size:17,align:"left",valign:"middle"});

    }

    attach(pawn){
        // attach this HUD to a pawn
        this.pawn=pawn;
    }
    update(){
        
    }
    draw(){

        this.canvas=new Rect(0,0,game.width(),game.height());

        this.drawWeapon();
        this.drawHealth();
        this.drawMoney();
    }
    drawWeapon(){
        
        if(!this.pawn) return;
        const w = this.pawn.weapon();
        if(!w) return;

        // position near bottom of screen:
        let y=16;

        // calculate size of ammo txt box:
        let txt=w.ammo.toString(); // text string
        let txtWidth = this.fontWeaponAmmo.measure(txt).width + 20;
        if(txtWidth < 35) txtWidth = 35;
        const txtHeight=26;
        
        // draw the bullets:
        this.drawBullets(this.canvas.max().x-txtWidth, y, txtHeight);

        // draw the ammo txt box:
        gfx.fillStyle="#000";
        gfx.fillRect(this.canvas.max().x-txtWidth,y-txtHeight/2,txtWidth,txtHeight);
        this.fontWeaponAmmo.apply();
        gfx.fillText(txt,this.canvas.max().x-10,1+y);

        let img = null;
        switch(w.type){
            case 1: img=sprites.hudGun1; break;
            case 2: img=sprites.hudGun2; break;
            case 3: img=sprites.hudGun3; break;
            case 4: img=sprites.hudGun4; break;
            case 5: img=sprites.hudGun5; break;
        }
        if(img){
            y+=16;
            gfx.drawImage(img, this.canvas.max().x-img.width, y);
            y+=12;
            this.fontWeaponTitle.apply();
            gfx.fillText(w.title, this.canvas.max().x-img.width/2,y)
        }
    }
    drawBullets(x, y, height){

        if(!this.pawn) return;
        const w=this.pawn.weapon();//weapon
        if(!w) return;
        const bw=7;//bullet width
        const bm=4;//bullet margin
        const sm=4;//side margins
        const bs=bw+bm;//bullet spread
        
        const b=w.clip;//loaded bullets
        const c=w.clipMax;//clip size
        const bulletsMissing = (c-b); // how many bullets are missing from magazine
        
        const bgw=bs*c+sm*2-4; // width of rectangle holding bullets
        let bgx = bulletsMissing * bs; // x-offset of rectangle
        if(bgx < 0) bgx += 2-sm;

        // draw transparent bg:
        gfx.fillStyle="rgba(10,10,20,.25)";
        gfx.fillRect(x,y-height/2,-bgw,height);
        
        const reloadPercent = w.getReloadProgress();
        if(reloadPercent>=1){
            //slide out:
            this.ammoPercent = Maths.lerp(this.ammoPercent,1,Maths.slide(.01,game.time.dt)); // calculate background position
        } else {
            // slide away:
            this.fontWeaponAmmo.apply();
            gfx.fillText("reloading",x-10, y);
            this.ammoPercent = Maths.lerp(this.ammoPercent,0,Maths.slide(.01,game.time.dt));
        }

        x=x-bgw*this.ammoPercent+bgx;
        
        Matrix.push();
        Matrix.translate(x,y);

        // draw filled bg:
        gfx.fillStyle="rgb(75,75,75)";
        gfx.fillRect(0,-height/2,bgw,height);
        
        // draw individual bullets:
        for(var i=0;i<c;i++){
            gfx.drawImage(sprites.bullet,(sm+bs*i),-7);
        }
        
        Matrix.pop();
    }
    drawHealth(){
        
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
    drawMoney(){
        this.fontCoins.apply();
        gfx.drawImage(sprites.item3, 5, game.height()-75);
        gfx.fillText(PlayerController.data.coins, 30, game.height()-62);
    }
}