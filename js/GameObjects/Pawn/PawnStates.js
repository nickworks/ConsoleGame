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

            if(pawn.input.move != 0) pawn.state=PawnStates.walking;
            if(pawn.input.jump)pawn.launch({y:-350},true);

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
    inAir:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("inAir", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            pawn.moveH(pawn.input.move);
            pawn.moveV();
            if(pawn.isGrounded) pawn.state=PawnStates.idle;

        }
    },
    jumping:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("jumping", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            pawn.moveH(pawn.input.move);
            pawn.moveV(.4);
            if(pawn.vy>0 || pawn.input.jump==false) pawn.state=PawnStates.inAir;

        }
    },
    crouching:{
        draw(pawn){
            if(!PawnStates.isPawn(pawn)) return;
            PawnStates.drawTextAbove("crouching", pawn);
        },
        update(pawn){
            if(!PawnStates.isPawn(pawn)) return;

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
            if(!pawn.isGrounded)pawn.state=PawnStates.inAir;
            if(pawn.input.jump)pawn.launch({y:-350},true);
            pawn.moveH(pawn.input.move);
            pawn.moveV();
        }
    },
}