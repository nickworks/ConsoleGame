// These states are all related to pawn MOVEMENT.
// Other states (e.g. weapon reloading) need to exist elsewhere.
const PawnStates={
	

    // this draws a textfield above a pawn
    drawDebug:(state, pawn)=>{

        if(!Game.DEVMODE) return;

        const gfx=game.view.gfx;
        const mid=pawn.rect.mid();
        const name=state.constructor.name;

        gfx.font="10pt Courier";
        gfx.textAlign="center";
        gfx.textBaseline="middle";
        gfx.fillStyle="#000";
        gfx.fillText(name,mid.x,pawn.rect.y-15);
    },
    // this checks if an obj is a pawn
    isPawn:(obj)=>{
        if(!obj) return false; // not even an object
        if(!obj.constructor) return false; // it has no constructor
        return (obj.constructor.name=="Pawn");
    },
	/*

    There are several states below. Each state
    should follow this basic template:

	state:function(pawn){
		this.draw=()=>{};
		this.update=()=>{};
        this.jump=()=>{};
	}
    
	*/

    idle:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            if(pawn.mind&&pawn.mind.wantsToMove!=0) pawn.state=new PawnStates.walking(pawn); // switch to walking
            if(pawn.mind&&pawn.mind.wantsToCrouch) pawn.state =new PawnStates.crouched(pawn);

            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir(pawn); // switch to falling

            pawn.moveH();
            pawn.moveV();
        };
        this.jump=()=>{
            pawn.launch({y:-375},true);
        };
    },
    dead:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{

        };
    },
    hurt:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{

        };
    },
    inAir:function(pawn, isDropping=false, dropFrom=0){
        if(!PawnStates.isPawn(pawn)) return;
        this.isDropping=()=>{return isDropping;};
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            pawn.moveH(10,pawn.airControl);
            pawn.moveV();
            if(pawn.isGrounded)pawn.state=new PawnStates.idle(pawn);

            if(isDropping&&pawn.rect.y>dropFrom+20)pawn.state=new PawnStates.inAir(pawn); // if we're dropping and we've dropped 20 pixels, switch to inAir
            if(!isDropping){
                if(pawn.onWallLeft) pawn.state=new PawnStates.onWall(pawn,false); 
                if(pawn.onWallRight) pawn.state=new PawnStates.onWall(pawn,true);
            }
        };
        this.jump=()=>{ pawn.launch({y:-375},true); };
    },
    onWall:function(pawn,onRight){
        if(!PawnStates.isPawn(pawn)) return;
        onRight=!!onRight;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            const slidOffWall=onRight?!pawn.onWallRight:!pawn.onWallLeft;
            if(slidOffWall) pawn.state=new PawnStates.inAir(pawn);

            if(pawn.isGrounded)pawn.state=new PawnStates.idle(pawn);

            pawn.moveH(1,pawn.airControl);
            pawn.moveV(.45);
        };
        this.jump=()=>{ pawn.launch({x:(onRight?-400:400),y:-400},false); };
    },
    launched:function(pawn,delayIgnoreInput=0){
        if(!PawnStates.isPawn(pawn)) return;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            delayIgnoreInput-=game.time.dt;
            if(delayIgnoreInput<=0)pawn.state=new PawnStates.inAir(pawn);

            pawn.moveH(10,0);
            pawn.moveV(10,.8);
        };
    },
    jumping:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            pawn.moveH(1,pawn.airControl);
            pawn.moveV(1,.4); // less gravity when jumping

            if(pawn.vy>0)pawn.state=new PawnStates.inAir(pawn);
            if(pawn.mind&&!pawn.mind.wantsToJump) pawn.state=new PawnStates.inAir(pawn);
        };
    },
    crouched:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;

        this.isStealth=true;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir();

            if(pawn.mind&&pawn.mind.wantsToMove!=0)pawn.state=new PawnStates.sneaking(pawn);
            if(pawn.mind&&!pawn.mind.wantsToCrouch)pawn.state=new PawnStates.idle(pawn);

            pawn.moveH(.5);
            pawn.moveV();
        };
        this.jump=()=>{
            if(pawn.onOneway)pawn.drop();
            else {
                pawn.launch({y:-275},true); // set state to  jumping
            }
        };
    },
    sneaking:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;
        this.isStealth=true;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            if(pawn.mind&&pawn.mind.wantsToMove==0)pawn.state=new PawnStates.crouched(pawn);
            if(pawn.mind&&!pawn.mind.wantsToCrouch)pawn.state=new PawnStates.idle(pawn);

            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir(pawn);

            pawn.moveH(.5);
            pawn.moveV();
        };
        this.jump=()=>{
            if(pawn.onOneway)pawn.drop();
            else {
                pawn.launch({y:-275},true); // set state to  jumping
            }
        };
    },
    walking:function(pawn){
        if(!PawnStates.isPawn(pawn)) return;
        this.draw=()=>PawnStates.drawDebug(this, pawn);
        this.update=()=>{
            if(pawn.mind&&pawn.mind.wantsToMove==0)pawn.state=new PawnStates.idle(pawn);
            if(pawn.mind&&pawn.mind.wantsToCrouch)pawn.state=new PawnStates.sneaking(pawn);

            if(!pawn.isGrounded)pawn.state=new PawnStates.inAir(pawn);

            pawn.moveH();
            pawn.moveV();
        };
        this.jump=()=>{ pawn.launch({y:-375},true); };
    },
}