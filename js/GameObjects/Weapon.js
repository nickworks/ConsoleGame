function Weapon(raw={}){
    
    var shootDelay=0;
    var reloadDelay=0;
    
    this.shootCooldown=.25;
    this.reloadCooldown=1;
    
    this.ammo=100;
    this.ammoMax=100;
    
    this.clip=0;
    this.clipMax=5;
    
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
            dir.x*=speed;
            dir.y*=speed;
            
            const b=new Bullet(pos,dir,isFriend);
            scene.bullets.push(b);
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