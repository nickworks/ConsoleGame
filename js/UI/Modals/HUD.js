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

        this.rect=new Rect(0,0,game.width(),game.height());

        this.drawWeapon();
        this.drawHealth();
        this.drawMoney();
    }
    drawWeapon(){
        
        if(!this.pawn) return;
        const w = this.pawn.weapon();
        if(!w) return;

        // calculate size of ammo txt box:

        let txt=w.clip+"  /  "+(w.ammo-w.clip); // text string
        let txtWidth = this.fontWeaponAmmo.measure(txt).width + 20;
        if(txtWidth < 35) txtWidth = 35;
        const txtHeight=26;
        
        const rightEdge = this.rect.max().x; // the right edge of the screen

        let y=0;
        let x=rightEdge-171;

        // draw the bullets:
        this.drawBullets(x-txtWidth, 13, txtHeight);

        // draw the ammo txt box:
        gfx.fillStyle="#000";
        gfx.fillRect(x-txtWidth,0,txtWidth,txtHeight);
        this.fontWeaponAmmo.apply();
        gfx.fillText(txt,x-10,14);


        if(w.isReloading()){
            //this.fontWeaponAmmo.apply();
            gfx.fillStyle="rgba(0,0,0,.5)";
            gfx.fillRect(x,y+26,-100,26);
            gfx.fillStyle="#FFF";
            gfx.fillText("reloading",x-10, y+39);
        } else if(w.isEmpty()){
            gfx.fillStyle="rgba(255,10,10,.9)";
            gfx.fillRect(x,y+26,-80,26);
            gfx.fillStyle="#FFF";
            gfx.fillText("EMPTY",x-10, y+39);
        }

        let img = null;
        switch(w.constructor.name){
            case "Pistol": img=sprites.hudGun1; break;
            case "Rifle": img=sprites.hudGun2; break;
            case "Shotgun": img=sprites.hudGun3; break;
            case "SMG": img=sprites.hudGun4; break;
            case "RocketLauncher": img=sprites.hudGun5; break;
        }
        if(img){
            // draw weapon image:
            gfx.drawImage(img, rightEdge-img.width, y);
            // draw weapon title:
            this.fontWeaponTitle.apply();
            gfx.fillText(w.title, rightEdge-img.width/2,y+12);
        }
    }
    drawBullets(x, y, height){

        if(!this.pawn) return;
        const w=this.pawn.weapon();//weapon
        if(!w) return;

        // if this is less than 1, the weapon is reloading

        const bw=7;//bullet width
        const bm=4;//bullet margin
        const sm=4;//side margins
        const bs=bw+bm;//bullet spread
        
        const b=w.clip;//loaded bullets
        const c=w.clipMax;//clip size
        const bulletsMissing = (c-b); // how many bullets are missing from magazine
        
        const isEmpty = (w.clip<=0);

        const bgw=bs*c+sm*2-4; // width of rectangle holding bullets
        let bgx = bulletsMissing * bs; // x-offset of rectangle
        if(bgx < 0) bgx += 2-sm;

        gfx.fillStyle="rgba(10,10,20,.25)";
        gfx.fillRect(x,y-height/2,-bgw,height);

        let targetPercent = (w.isReloading()||w.isEmpty())?0:1;
        this.ammoPercent = Maths.lerp(this.ammoPercent,targetPercent,Maths.slide(.001,game.time.dt)); // calculate background position

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