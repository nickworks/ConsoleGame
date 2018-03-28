function Weapon(raw={}){
    this.jumpCooldown=0;
    this.jumpCooldownAmt=.5;
    this.shootCooldown=0;
    this.shootCooldownAmt=.5;
    this.reloadCooldown=0;
    this.reloadCooldownAmt=3;
    this.ammo=100;
    this.ammoAmt=100;
    
    this.clip=0;
    this.clipAmt=5;
    
    this.update=function(dt){
        if(this.reloadCooldown>0){
            this.reloadCooldown-=dt;
            if(this.reloadCooldown<=0)this.reload();
        }
        else if(this.shootCooldown>0)this.shootCooldown-=dt;
    };
    this.shoot=function(pos,dir,isFriend){
        if(this.reloadCooldown>0)return;
        if(this.shootCooldown>0)return;
        if(!scene.bullets)return;
        
        if(this.clip>0){
            
            let speed=600;
            dir.x*=speed;
            dir.y*=speed;
            
            const b=new Bullet(pos,dir,isFriend);
            scene.bullets.push(b);
            this.shootCooldown=this.shootCooldownAmt;
            this.ammo--;
            this.clip--;
        } else {
            this.reloadCooldown=this.reloadCooldownAmt;
        }
        //console.log(this.ammo+" "+this.clip);
    };
    this.reload=function(){
        this.clip=Math.min(this.ammo,this.clipAmt);
    };
    this.reload();
}