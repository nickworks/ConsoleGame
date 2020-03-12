class PhysicsComponent {
	constructor(obj){
		this.obj=obj;
        this.vx=0;
        this.vy=0;
        this.bounciness=.3;
        this.isAsleep=false;
        this.isGrounded=false;
    }
    getVelMagSq(){
        return this.vx*this.vx+this.vy*this.vy;
    }
    update(){
        if(this.isAsleep)return;

        this.slowOnGround();
        
        this.vy+=scene.gravity*game.time.dt;
        this.obj.rect.x+=this.vx*game.time.dt;
        this.obj.rect.y+=this.vy*game.time.dt;
        this.isGrounded=false;
    }
    getMass(){
    	return (this.obj.rect.w*this.obj.rect.h)/500;
    }
    impulse(f={}){
        this.isAsleep=false;
        const mass=this.getMass();
        this.vx+=+f.x/mass;
        this.vy+=+f.y/mass;
    }
    slowOnGround(){
        if(!this.isGrounded)return;
        var move=0;
        if(this.vx<0)move+=2;
        if(this.vx>0)move-=2;
        this.vx+=move*400*game.time.dt;
        if(move<0&&this.vx<0)this.vx=0;
        if(move>0&&this.vx>0)this.vx=0;
        if(this.vx==0&&this.vy==0) this.isAsleep=true;
    }
    applyFix(fix){
        if(fix.x!=0)this.vx*=-.5;
        if(fix.y<0) this.isGrounded=true;
        if(fix.y!=0){
            const before=this.vy;
            this.vy*=-.5;
            if(Math.abs(this.vy+before)<10) this.vy=0;
        }
    }
}