
class Weapon {

    static Type = {
        WEAK: 1,
        PISTOL: 2,
        SHOTGUN: 3,
        SMG: 4,
        ROCKET: 5,
    }

    static random(){
        const t=((Math.random()*4)|0)+2;
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
                this.shootCooldown=.5;
                this.reloadCooldown=1;
                this.ammo=this.ammoMax=100;
                this.clip=this.clipMax=10;
                this.dmg=10;
                this.shootAmt=1;
                this.angleRand=0;
                this.title="PEA-SHOOTER";
                this.explode=false;
                break;
            case Weapon.Type.PISTOL:
                this.shootCooldown=.25;
                this.reloadCooldown=1;
                this.ammo=this.ammoMax=20;
                this.clip=this.clipMax=5;
                this.dmg=25;
                this.shootAmt=1;
                this.angleRand=.01;
                this.title="PISTOL";
                this.explode=false;
                break;
            case Weapon.Type.SHOTGUN:
                this.shootCooldown=.5;
                this.reloadCooldown=2;
                this.ammo=this.ammoMax=10;
                this.clip=this.clipMax=2;
                this.dmg=25;
                this.shootAmt=5;
                this.angleRand=.5;
                this.title="SHOTGUN";
                this.explode=false;
                break;
            case Weapon.Type.SMG:
                this.shootCooldown=.1;
                this.reloadCooldown=2;
                this.ammo=this.ammoMax=90;
                this.clip=this.clipMax=30;
                this.dmg=10;
                this.shootAmt=1;
                this.angleRand=.1;
                this.title="SMG";
                this.explode=false;
                break;
            case Weapon.Type.ROCKET:
                this.shootCooldown=1;
                this.reloadCooldown=3;
                this.ammo=this.ammoMax=12;
                this.clip=this.clipMax=6;
                this.dmg=50;
                this.shootAmt=1;
                this.angleRand=0;
                this.title="ROCKET LAUNCHER";
                this.explode=true;
                break;
            default:
                game.console.log("// Weapon type not recognized.");
                return;
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
    shoot(pos,dir,isFriend){
        if(this.reloadDelay>0)return;
        if(this.shootDelay>0)return;
        if(!scene.objs)return;
        
        if(this.clip>0){
            
            let speed=600;
            let angle=(dir<0)?Math.PI:0;
            
            for(var i=0;i<this.shootAmt;i++){
                
                var finalAngle=angle+Math.random()*this.angleRand-this.angleRand/2;
                
                const dir={};
                dir.x=Math.cos(finalAngle)*speed
                dir.y=Math.sin(finalAngle)*speed
                const b=new Bullet(pos,dir,isFriend,this.dmg);
                b.explode=this.explode;
                scene.objs.add(b);
            }
            this.shootDelay=this.shootCooldown;
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
}