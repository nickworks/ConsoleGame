function Weapon(raw={}){    
    
    const TYPE_WEAK=1;
    const TYPE_PISTOL=2;
    const TYPE_SHOTGUN=3;
    const TYPE_SMG=4;
    
    var type;
    var shootDelay=0;
    var reloadDelay=0;
    
    this.changeType=function(t){
        switch(t){
            case TYPE_WEAK:
                this.shootCooldown=.5;
                this.reloadCooldown=1;
                this.ammo=this.ammoMax=100;
                this.clip=this.clipMax=10;
                this.dmg=10;
                this.shootAmt=1;
                this.angleRand=0;
                this.title="PEA-SHOOTER";
                break;
            case TYPE_PISTOL:
                this.shootCooldown=.25;
                this.reloadCooldown=1;
                this.ammo=this.ammoMax=20;
                this.clip=this.clipMax=5;
                this.dmg=25;
                this.shootAmt=1;
                this.angleRand=.01;
                this.title="PISTOL";
                break;
            case TYPE_SHOTGUN:
                this.shootCooldown=.5;
                this.reloadCooldown=2;
                this.ammo=this.ammoMax=10;
                this.clip=this.clipMax=2;
                this.dmg=25;
                this.shootAmt=5;
                this.angleRand=.5;
                this.title="SHOTGUN";
                break;
            case TYPE_SMG:
                this.shootCooldown=.1;
                this.reloadCooldown=2;
                this.ammo=this.ammoMax=90;
                this.clip=this.clipMax=30;
                this.dmg=10;
                this.shootAmt=1;
                this.angleRand=.1;
                this.title="SMG";
                break;
            default:
                consoleObj.log("\\ Weapon type not recognized.");
                return;
        }
        type=t;
    };
    this.changeType(raw.t||TYPE_WEAK);
    
    this.update=function(dt){
        
        if(this.ammo>this.ammoMax)this.ammo=this.ammoMax;
        if(this.clip>this.clipMax)this.clip=this.clipMax;
        
        if(reloadDelay>0){
            reloadDelay-=dt;
            if(reloadDelay<=0)this.doReload();
        }
        else if(shootDelay>0)shootDelay-=dt;
        
        if(keyboard.onDown(key.reload())){
            this.reload();
        }        
    };
    this.shoot=function(pos,dir,isFriend){
        if(reloadDelay>0)return;
        if(shootDelay>0)return;
        if(!scene.bullets)return;
        
        if(this.clip>0){
            
            let speed=600;
            let angle=(dir<0)?Math.PI:0;
            
            for(var i=0;i<this.shootAmt;i++){
                
                var finalAngle=angle+Math.random()*this.angleRand-this.angleRand/2;
                
                const dir={};
                dir.x=Math.cos(finalAngle)*speed
                dir.y=Math.sin(finalAngle)*speed
                const b=new Bullet(pos,dir,isFriend,this.dmg);
                scene.bullets.push(b);
            }
            shootDelay=this.shootCooldown;
            this.ammo--;
            this.clip--;
        } else {
            this.reload();
        }
    };
    this.reload=function(){
        if(reloadDelay>0)return;
        if(shootDelay>0)return;
        if(this.clip>=this.clipMax)return;
        if(this.ammo<=0)return;
        reloadDelay=this.reloadCooldown;
    };
    this.doReload=function(){
        this.clip=Math.min(this.ammo,this.clipMax);
    };
    this.getReloadProgress=function(){
        if(reloadDelay<=0)return 1;
        return reloadDelay/this.reloadCooldown;
    }
    this.addAmmo=function(amt=10){
        this.ammo+=amt;
        if(this.ammo>this.ammoMax)this.ammo=this.ammoMax;
    };
    this.clip=this.clipMax;
}
Weapon.random=function(){
    const t=((Math.random()*4)|0)+1;
    return new Weapon({t:t});
};