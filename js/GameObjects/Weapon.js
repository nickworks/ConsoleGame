
class Weapon {

    static types=[];    

    static random(){
        if(!Array.isArray(Weapon.types)||Weapon.types.length==0)return;
        const t=parseInt(Math.random()*Weapon.types.length);
        const type=Weapon.types[t];
        if(typeof type == "function")return new type();
    }
    constructor(raw={}){
        this.type;
        this.shootDelay=0;
        this.timeUntilReloaded=0;
        this.clip=this.clipMax;
    }
    drawAimLine(pawn){
        if(!pawn||!pawn.mind)return;
        if(!this.aimCache)this.aimCache={
            angle:0,
            alpha:0,
            len:100,
            spread:0,
        };
        if(this.aimCache.alpha<.25) this.aimCache.alpha+=game.time.dt;
        if(this.aimCache.alpha>0){

            const isAiming = (pawn.mind.wantsToAim);

            // what length do we want the center line?
            let targetLen = isAiming ? this.aimDistance*(pawn.mind.weaponAccuracy) : 40;
            targetLen += 40;
            this.aimCache.len = Maths.lerp(this.aimCache.len,targetLen,Maths.slide(.001));

            // distance to the start and end of the center line
            const dis1 = 50;
            const dis2 = 55;

            // distances to the start and end of the outer lines
            const dis3 = 40;
            const dis4 = this.aimCache.len * pawn.mind.weaponAccuracy;

            let targetSpread = pawn.jitterSpread();
            const angle = this.aimCache.angle;
            const spread = this.aimCache.spread=Maths.lerp(this.aimCache.spread,targetSpread,Maths.slide(.001));
            const dir0=Maths.vecFromAngle(angle);
            const dir1=Maths.vecFromAngle(angle+spread);
            const dir2=Maths.vecFromAngle(angle-spread);

            const p = pawn.rect.mid();
            gfx.beginPath();
            gfx.moveTo(p.x+dir1.x*dis3,p.y+dir1.y*dis3);
            gfx.lineTo(p.x+dir1.x*dis4,p.y+dir1.y*dis4);

            gfx.moveTo(p.x+dir2.x*dis3,p.y+dir2.y*dis3);
            gfx.lineTo(p.x+dir2.x*dis4,p.y+dir2.y*dis4);

            // draw middle line:
            gfx.moveTo(p.x+dir0.x*dis1,p.y+dir0.y*dis1);
            gfx.lineTo(p.x+dir0.x*dis2,p.y+dir0.y*dis2);

            gfx.lineWidth=2;
            gfx.strokeStyle="rgba(0,0,0,"+this.aimCache.alpha+")";
            gfx.stroke();
        }
    }
    update(){
        
        if(this.ammo>this.ammoMax)this.ammo=this.ammoMax;
        if(this.clip>this.clipMax)this.clip=this.clipMax;
        
        if(this.timeUntilReloaded>0){ // if reloading...
            this.timeUntilReloaded-=game.time.dt; // count down
            if(this.timeUntilReloaded<=0)this.doReload(); // reload!
        }
        else if(this.shootDelay>0)this.shootDelay-=game.time.dt;
    }
    noShoot(){
        this.isTriggerHeld=false;
    }
    shoot(pos,shooter){
        if(!this.auto&&this.isTriggerHeld)return;
        this.isTriggerHeld=true;
        if(this.timeUntilReloaded>0)return;
        if(this.shootDelay>0)return;
        if(!this.aimCache)return;
        if(!scene.objs)return;
        
        if(this.clip>0){
            
            let angle=this.aimCache.angle;
            let spread = this.spread;
            let parentv = {x:0,y:0};
            if(shooter&&shooter.pawn){
                spread = shooter.pawn.jitterSpread();
                shooter.pawn.launch(Maths.vecFromAngle(angle,-this.knockbackForce),false);
                parentv.x = shooter.pawn.rect.vx;
                parentv.y = shooter.pawn.rect.vy;
            }
            for(var i=0;i<this.shootAmt;i++){
                
                var finalAngle=angle+Maths.rand(-spread,spread);
                var finalSpeed=this.speed+Maths.randBell(-this.speedRand,this.speedRand);
                const v={};
                v.x=Math.cos(finalAngle)*finalSpeed;
                v.y=Math.sin(finalAngle)*finalSpeed;
                v.x+=parentv.x;
                v.y+=parentv.y;
                const b=new Bullet(pos,v,shooter&&shooter.friend,this.dmg);
                
                b.explode=this.explode;
                scene.objs.add(b);
            }
            this.shootDelay=this.timeBetweenShots;
            this.ammo--;
            this.clip--;
            if(this.sound)sfx.play(this.sound);
        } else {
            sfx.play("outofammo");
            this.reload();
        }
    }
    reload(){
        if(this.timeUntilReloaded>0)return;
        if(this.shootDelay>0)return;
        if(this.clip>=this.clipMax)return;
        if(this.ammo<=0)return;
        this.timeUntilReloaded=this.timeToReload;
    }
    doReload(){
        this.clip=Math.min(this.ammo,this.clipMax);
    }
    getReloadProgress(){
        if(this.timeUntilReloaded<=0)return 1;
        return this.timeUntilReloaded/this.timeToReload;
    }
    addAmmo(amt=10){
        this.ammo+=amt;
        if(this.ammo>this.ammoMax)this.ammo=this.ammoMax;
    }
    isEmpty(){
        return this.clip<=0;
    }
    isReloading(){
        return this.getReloadProgress() < 1;
    }
    getSprite(){
        switch(this.constructor.name){
            case "Pistol": return sprites.gun1;
            case "Rifle": return sprites.gun2;
            case "Shotgun": return sprites.gun3;
            case "SMG":  return sprites.gun4;
            case "RocketLauncher": return sprites.gun5;
        }
    }
    getSpriteGUI(){
        switch(this.constructor.name){
            case "Pistol": return sprites.hudGun1;
            case "Rifle": return sprites.hudGun2;
            case "Shotgun": return sprites.hudGun3;
            case "SMG":  return sprites.hudGun4;
            case "RocketLauncher": return sprites.hudGun5;
        }
    }
}
Weapon.Pistol=class Pistol extends Weapon {
    constructor(){
        super();
        this.title="PISTOL";

        this.timeBetweenShots=.02;
        this.timeToReload=.5;
        this.ammo=this.ammoMax=100;
        this.clip=this.clipMax=8;
        this.shootAmt=1;
        this.spread=.1;
        this.auto=false;
        this.knockbackForce=10;
        this.aimDistance=200;

        this.dmg=20;
        this.speed=1000;
        this.speedRand=0;
        this.explode=false;

        this.sound="pistol";
    }
};
Weapon.SMG = class SMG extends Weapon {
    constructor(){
        super();
        this.title="SMG";
        this.timeBetweenShots=.1;
        this.timeToReload=2;
        this.ammo=this.ammoMax=90;
        this.clip=this.clipMax=30;
        this.auto=true;
        this.dmg=10;
        this.shootAmt=1;
        this.spread=.2;
        this.speed=1200;
        this.speedRand=0;
        this.explode=false;
        this.knockbackForce=200;
        this.aimDistance=100;
        this.sound="smg";
    }
};
Weapon.Rifle = class Rifle extends Weapon {
    constructor(){
        super();
        this.title="RIFLE";
        this.timeBetweenShots=1;
        this.timeToReload=1;
        this.ammo=this.ammoMax=20;
        this.clip=this.clipMax=5;
        this.dmg=55;
        this.auto=false;
        this.shootAmt=1;
        this.speed=2400;
        this.speedRand=0;
        this.spread=.01;
        this.explode=false;
        this.knockbackForce=300;
        this.aimDistance=200;
        this.sound="rifle";
    }
};
Weapon.Shotgun = class Shotgun extends Weapon {
    constructor(){
        super();
        this.title="SHOTGUN";
        this.timeBetweenShots=.5;
        this.timeToReload=.75;
        this.ammo=this.ammoMax=10;
        this.clip=this.clipMax=4;
        this.auto=false;
        this.dmg=10;
        this.shootAmt=12;
        this.spread=.5;
        this.speed=1000;
        this.speedRand=200;
        this.explode=false;
        this.knockbackForce=500;
        this.aimDistance=75;
        this.sound="shotgun1";
    }
};
Weapon.RocketLauncher = class RocketLauncher extends Weapon {
    constructor(){
        super();
        this.title="ROCKET LAUNCHER";
        this.timeBetweenShots=1;
        this.timeToReload=3;
        this.ammo=this.ammoMax=12;
        this.clip=this.clipMax=6;
        this.auto=false;
        this.dmg=50;
        this.shootAmt=1;
        this.spread=.1;
        this.speed=700;
        this.speedRand=50;
        this.explode=true;
        this.knockbackForce=50;
        this.aimDistance=75;
        this.sound="rocket";
    }
};
Weapon.types=[
    Weapon.Pistol,
    Weapon.SMG,
    Weapon.Rifle,
    Weapon.Shotgun,
    Weapon.RocketLauncher,
];