const PawnStates={
	
	/*
	state:{
		draw(pawn){},
		update(pawn){},
	}
	*/

    drawTextAbove:(name,pawn)=>{
        const gfx=game.view.gfx;
        const mid = pawn.rect.mid();
        
        gfx.font="10pt Courier";
        gfx.textAlign="center";
        gfx.textBaseline="middle";
        gfx.fillStyle="#000";
        gfx.fillText(name,mid.x,pawn.rect.y-15);
    },
    isPawn:(pawn)=>{
        if(!pawn) return false; // not even an object
        if(!pawn.constructor) return false; // it has no constructor
        return (pawn.constructor.name=="Pawn");
    },

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