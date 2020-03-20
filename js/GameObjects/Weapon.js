
class Weapon {

    static Type = {
        WEAK: 1,
        RIFLE: 2,
        SHOTGUN: 3,
        SMG: 4,
        ROCKET: 5,
    }

    static random(){
        const t=parseInt(Math.random()*5+1);
        return new Weapon({t:t});
    }

    constructor(raw={}){
        this.type;
        this.shootDelay=0;
        this.reloadDelay=0;
        this.changeType(raw.t||Weapon.Type.WEAK);
        this.clip=this.clipMax;
    }

    // TODO: maybe move this into the /data/ folder?
    changeType(t){
        switch(t){
            case Weapon.Type.WEAK:
            default:
                this.title="PISTOL";

                this.timeBetweenShots=.4;
                this.timeToReload=.5;
                this.ammo=this.ammoMax=100;
                this.clip=this.clipMax=8;
                this.shootAmt=1;
                this.spread=.3;

                this.dmg=10;
                this.speed=1000;
                this.speedRand=0;
                this.explode=false;
                this.knockbackForce=10;


                break;
            case Weapon.Type.RIFLE:
                this.title="RIFLE";
                this.timeBetweenShots=1;
                this.timeToReload=1;
                this.ammo=this.ammoMax=20;
                this.clip=this.clipMax=5;
                this.dmg=55;
                this.shootAmt=1;
                this.speed=2400;
                this.speedRand=0;
                this.spread=.01;
                this.explode=false;
                this.knockbackForce=300;
                break;
            case Weapon.Type.SHOTGUN:
                this.title="SHOTGUN";
                this.timeBetweenShots=.5;
                this.timeToReload=.75;
                this.ammo=this.ammoMax=10;
                this.clip=this.clipMax=4;
                this.dmg=10;
                this.shootAmt=5;
                this.spread=.5;
                this.speed=1000;
                this.speedRand=200;
                this.explode=false;
                this.knockbackForce=500;
                break;
            case Weapon.Type.SMG:
                this.title="SMG";
                this.timeBetweenShots=.1;
                this.timeToReload=2;
                this.ammo=this.ammoMax=90;
                this.clip=this.clipMax=30;
                this.dmg=10;
                this.shootAmt=1;
                this.spread=.2;
                this.speed=1200;
                this.speedRand=0;
                this.explode=false;
                this.knockbackForce=200;
                break;
            case Weapon.Type.ROCKET:
                this.title="ROCKET LAUNCHER";
                this.timeBetweenShots=1;
                this.timeToReload=3;
                this.ammo=this.ammoMax=12;
                this.clip=this.clipMax=6;
                this.dmg=50;
                this.shootAmt=1;
                this.spread=.1;
                this.speed=700;
                this.speedRand=50;
                this.explode=true;
                this.knockbackForce=50;
                break;
        }
        this.type=t;
    }
    drawAimLine(pawn){
        if(!this.aimCache)this.aimCache={
            angle:0,
            alpha:0,
            len:100,
            spread:0,
        };
        if(this.aimCache.alpha<.25) this.aimCache.alpha+=game.time.dt;
        if(this.aimCache.alpha>0){
            let targetLen = 100;
            if(this.type==Weapon.Type.RIFLE) targetLen+=50;
            if(pawn.mind&&pawn.mind.wantsToAim) targetLen+=30;
            
            const dis1 = 50;
            const dis2 = this.aimCache.len = Maths.lerp(this.aimCache.len,targetLen,Maths.slide(.001));

            let targetSpread = pawn.jitterSpread();
            const spread = this.aimCache.spread=Maths.lerp(this.aimCache.spread,targetSpread,Maths.slide(.001));

            const dir1={
                x:Math.cos(this.aimCache.angle-spread),
                y:Math.sin(this.aimCache.angle-spread),
            };
            const dir2={
                x:Math.cos(this.aimCache.angle+spread),
                y:Math.sin(this.aimCache.angle+spread),
            };


            const p = pawn.rect.mid();
            gfx.beginPath();
            gfx.moveTo(p.x+dir1.x*dis1,p.y+dir1.y*dis1);
            gfx.lineTo(p.x+dir1.x*dis2,p.y+dir1.y*dis2);
            gfx.moveTo(p.x+dir2.x*dis1,p.y+dir2.y*dis1);
            gfx.lineTo(p.x+dir2.x*dis2,p.y+dir2.y*dis2);
            gfx.lineWidth=3;
            gfx.strokeStyle="rgba(0,0,0,"+this.aimCache.alpha+")";
            gfx.stroke();
        }
    }
    update(){
        
        if(this.ammo>this.ammoMax)this.ammo=this.ammoMax;
        if(this.clip>this.clipMax)this.clip=this.clipMax;
        
        if(this.reloadDelay>0){
            this.reloadDelay-=game.time.dt;
            if(this.reloadDelay<=0)this.doReload();
        }
        else if(this.shootDelay>0)this.shootDelay-=game.time.dt;       
    }
    shoot(pos,shooter){
        if(this.reloadDelay>0)return;
        if(this.shootDelay>0)return;
        if(!scene.objs)return;
        
        if(this.clip>0){
            
            let angle=this.aimCache.angle;
            let spread = this.spread;
            let parentv = {x:0,y:0};
            if(shooter&&shooter.pawn){
                spread = shooter.pawn.jitterSpread();
                shooter.pawn.launch({
                    x:-Math.cos(angle) * this.knockbackForce,
                    y:-Math.sin(angle) * this.knockbackForce,
                },false);
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
        } else {
            this.reload();
        }
    }
    reload(){
        if(this.reloadDelay>0)return;
        if(this.shootDelay>0)return;
        if(this.clip>=this.clipMax)return;
        if(this.ammo<=0)return;
        this.reloadDelay=this.timeToReload;
    }
    doReload(){
        this.clip=Math.min(this.ammo,this.clipMax);
    }
    getReloadProgress(){
        if(this.reloadDelay<=0)return 1;
        return this.reloadDelay/this.timeToReload;
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
}