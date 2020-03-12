// These states are all related to pawn MOVEMENT.
// Other states (e.g. weapon reloading) need to exist elsewhere.
const PawnStates={
	

    // this draws a textfield above a pawn
    drawTextAbove:(name,pawn)=>{
        const gfx=game.view.gfx;
        const mid = pawn.rect.mid();

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

	state:{
		draw(pawn){},
		update(pawn){},
	}
    
	*/

    idle:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("idle", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

            if(pawn.mind&&pawn.mind.wantsToMove!=0) pawn.state=PawnStates.walking; // switch to walking
            if(pawn.mind&&pawn.mind.wantsToCrouch) pawn.state = PawnStates.crouched;

            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir(); // switch to falling

            pawn.moveH();
            pawn.moveV();
        },
        jump(pawn){
            pawn.launch({y:-375},true);
        },
    },
    dead:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("dead", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

        }
    },
    hurt:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("hurt", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

        }
    },
    inAir:function(isDropping=false, dropFrom=0){
        this.isDropping=()=>{
            return isDropping;
        };
        this.draw=(pawn)=>{
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("inAir", pawn);
        };
        this.update=(pawn)=>{
            if(!PawnStates.isPawn(pawn)) return;
            pawn.moveH(1,pawn.airControl);
            pawn.moveV();
            if(pawn.isGrounded)pawn.state=PawnStates.idle;

            if(isDropping&&pawn.rect.y>dropFrom+20)pawn.state=new PawnStates.inAir(); // if we're dropping and we've dropped 20 pixels, switch to inAir
            if(!isDropping){
                if(pawn.onWallLeft) pawn.state=new PawnStates.onWall(false); 
                if(pawn.onWallRight) pawn.state=new PawnStates.onWall(true);
            }
        };
        this.jump=(pawn)=>{
            pawn.launch({y:-375},true);
        };
    },
    onWall:function(onRight){
        onRight=!!onRight;
        this.draw=(pawn)=>{
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("onWall", pawn);
        };
        this.update=(pawn)=>{
            if(!PawnStates.isPawn(pawn)) return;
            
            const slidOffWall=onRight?!pawn.onWallRight:!pawn.onWallLeft;
            if(slidOffWall) pawn.state=PawnStates.inAir();

            if(pawn.isGrounded)pawn.state=PawnStates.idle;

            pawn.moveH(1,pawn.airControl);
            pawn.moveV(.45);
        };
        this.jump=(pawn)=>{
            pawn.launch({x:(onRight?-600:600),y:-400},false); // set state to  jumping
        };
    },
    jumping:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("jumping", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            pawn.moveH(1,pawn.airControl);
            pawn.moveV(1,.4); // less gravity when jumping

            if(pawn.vy>0)pawn.state=new PawnStates.inAir();
            if(pawn.mind&&!pawn.mind.wantsToJump) pawn.state=new PawnStates.inAir();
        }
    },
    crouched:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("crouched", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            
            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir();

            if(pawn.mind&&pawn.mind.wantsToMove!=0)pawn.state=PawnStates.sneaking;
            if(pawn.mind&&!pawn.mind.wantsToCrouch)pawn.state=PawnStates.idle;

            pawn.moveH(.5);
            pawn.moveV();
        },
        jump(pawn){
            if(pawn.onOneway)pawn.drop();
            else {
                pawn.launch({y:-275},true); // set state to  jumping
            }
        },
    },
    sneaking:{
        isStealth:true,
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("sneaking", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

            if(pawn.mind&&pawn.mind.wantsToMove==0)pawn.state=PawnStates.crouched;
            if(pawn.mind&&!pawn.mind.wantsToCrouch)pawn.state=PawnStates.idle;

            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir();

            pawn.moveH(.5);
            pawn.moveV();
        },
        jump(pawn){
            if(pawn.onOneway)pawn.drop();
            else {
                pawn.launch({y:-275},true); // set state to  jumping
            }
        },
    },
    walking:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(Game.DEVMODE)PawnStates.drawTextAbove("walking", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

            if(pawn.mind&&pawn.mind.wantsToMove==0)pawn.state=PawnStates.idle;
            if(pawn.mind&&pawn.mind.wantsToCrouch)pawn.state=PawnStates.sneaking;

            if(!pawn.isGrounded)pawn.state=new PawnStates.inAir();

            pawn.moveH();
            pawn.moveV();
        },
        jump(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            pawn.launch({y:-375},true);
        },
    },
}