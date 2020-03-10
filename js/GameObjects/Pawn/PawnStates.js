// These states are all related to pawn MOVEMENT.
// Other states (e.g. reloading) need to exist elsewhere.
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
            PawnStates.drawTextAbove("idle", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

            if(pawn.input.move != 0) pawn.state=PawnStates.walking; // set state to walking
            if(pawn.input.onJump) pawn.launch({y:-350},true); // set state to  jumping
            if(pawn.input.crouch) pawn.state=PawnStates.crouching;
            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir();

            pawn.moveH(pawn.input.move);
            pawn.moveV();
        }
    },
    dead:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("dead", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

        }
    },
    hurt:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("hurt", pawn);
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
            PawnStates.drawTextAbove("inAir", pawn);
        };
        this.update=(pawn)=>{
            if(!PawnStates.isPawn(pawn)) return;
            pawn.moveH(pawn.input.move);
            pawn.moveV();
            if(pawn.isGrounded)pawn.state=PawnStates.idle;
            if(pawn.input.onJump)pawn.launch({y:-350},true); // set state to  jumping

            if(isDropping&&pawn.rect.y>dropFrom+20)pawn.state=new PawnStates.inAir();
        };
    },
    jumping:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("jumping", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            pawn.moveH(pawn.input.move);
            pawn.moveV(.4); // less gravity when jumping
            if(pawn.vy>0 || pawn.input.jump==false) pawn.state=new PawnStates.inAir();

        }
    },
    crouching:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("crouching", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            
            pawn.moveH(pawn.input.move);
            pawn.moveV();

            if(pawn.input.onJump) {
                pawn.drop();
                return;
            }
            if(!pawn.input.crouch) pawn.state = PawnStates.idle;
            if(!pawn.isGrounded) pawn.state=new PawnStates.inAir();
        }
    },
    sneaking:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("sneaking", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

        }
    },
    walking:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("walking", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            if(pawn.input.move==0)pawn.state=PawnStates.idle;
            if(!pawn.isGrounded)pawn.state=new PawnStates.inAir();
            if(pawn.input.onJump)pawn.launch({y:-350},true);
            if(pawn.input.crouch)pawn.state=PawnStates.crouching;
            pawn.moveH(pawn.input.move);
            pawn.moveV();
        }
    },
}