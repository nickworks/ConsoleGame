
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
                this.shootCooldown=.4;
                this.reloadCooldown=.5;
                this.ammo=this.ammoMax=100;
                this.clip=this.clipMax=8;
                this.dmg=10;
                this.shootAmt=1;
                this.angleRand=.3;
                this.speed=1000;
                this.speedRand=0;
                this.explode=false;
                this.knockbackForce=10;
                break;
            case Weapon.Type.RIFLE:
                this.title="RIFLE";
                this.shootCooldown=1;
                this.reloadCooldown=1;
                this.ammo=this.ammoMax=20;
                this.clip=this.clipMax=5;
                this.dmg=55;
                this.shootAmt=1;
                this.speed=2400;
                this.speedRand=0;
                this.angleRand=.01;
                this.explode=false;
                this.knockbackForce=300;
                break;
            case Weapon.Type.SHOTGUN:
                this.title="SHOTGUN";
                this.shootCooldown=.5;
                this.reloadCooldown=.75;
                this.ammo=this.ammoMax=10;
                this.clip=this.clipMax=4;
                this.dmg=10;
                this.shootAmt=5;
                this.angleRand=.5;
                this.speed=1000;
                this.speedRand=200;
                this.explode=false;
                this.knockbackForce=500;
                break;
            case Weapon.Type.SMG:
                this.title="SMG";
                this.shootCooldown=.1;
                this.reloadCooldown=2;
                this.ammo=this.ammoMax=90;
                this.clip=this.clipMax=30;
                this.dmg=10;
                this.shootAmt=1;
                this.angleRand=.2;
                this.speed=1200;
                this.speedRand=0;
                this.explode=false;
                this.knockbackForce=200;
                break;
            case Weapon.Type.ROCKET:
                this.title="ROCKET LAUNCHER";
                this.shootCooldown=1;
                this.reloadCooldown=3;
                this.ammo=this.ammoMax=12;
                this.clip=this.clipMax=6;
                this.dmg=50;
                this.shootAmt=1;
                this.angleRand=0;
                this.speed=700;
                this.speedRand=50;
                this.explode=true;
                this.knockbackForce=50;
                break;
        }
        this.type=t;
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
    shoot(pos,dir,shooter){
        if(this.reloadDelay>0)return;
        if(this.shootDelay>0)return;
        if(!scene.objs)return;
        
        if(this.clip>0){
            
            let angle=dir;
            
            const spread = this.angleRand/2;

            for(var i=0;i<this.shootAmt;i++){
                
                var finalAngle=angle+Maths.randBell(-spread,spread);
                var finalSpeed=this.speed+Maths.randBell(-this.speedRand,this.speedRand);
                const dir={};
                dir.x=Math.cos(finalAngle)*finalSpeed;
                dir.y=Math.sin(finalAngle)*finalSpeed;
                const b=new Bullet(pos,dir,shooter&&shooter.friend,this.dmg);
                b.explode=this.explode;
                scene.objs.add(b);
            }
            this.shootDelay=this.shootCooldown;
            this.ammo--;
            this.clip--;
            if(shooter&&shooter.pawn){

                shooter.pawn.launch({
                    x:-Math.cos(dir) * this.knockbackForce,
                    y:-Math.sin(dir) * this.knockbackForce,
                },false);
            }
        } else {
            this.reload();
        }
    }
    reload(){
        if(this.reloadDelay>0)return;
        if(this.shootDelay>0)return;
        if(this.clip>=this.clipMax)return;
        if(this.ammo<=0)return;
        this.reloadDelay=this.reloadCooldown;
    }
    doReload(){
        this.clip=Math.min(this.ammo,this.clipMax);
    }
    getReloadProgress(){
        if(this.reloadDelay<=0)return 1;
        return this.reloadDelay/this.reloadCooldown;
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