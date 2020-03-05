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

        }
    },
    dead:{},
    hurt:{},
    inAir:{},
    jumping:{},
    crouching:{},
    sneaking:{},
    walking:{},
}