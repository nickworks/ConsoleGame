class Scene {
	constructor(){
		this.objs={
			get(i){
				return this.all[i]||{};
			},
			getUnderMouse(){
				let obj = null;
				this.all.forEach(o=>{
					const rect=o.rect||o.pawn.rect;
					if(rect.mouseOver())obj=o; 
				});
				return obj;
			},
			clear(){
				this.all =[];
                this.blocking =[];
                this.pawns =[];
                this.physics =[];
                this.bullets =[];
                this.damageable =[];
			},
            add(obj){
                this.all.push(obj);
                switch(obj.constructor.name){
                    case "Platform":
                    case "Crate":
                    case "Door":
                        this.blocking.push(obj);
                        break;
                    case "PlayerController":
                    case "AIController":
                        this.pawns.push(obj);
                        break;
                    case "PlayerController":
                    case "AIController":
                    case "Crate":
                        this.damageable.push(obj);
                        break;
                    case "Item":
                        this.physics.push(obj);
                        break;
                    case "Bullet":
                        this.bullets.push(obj);
                        break;
                }
            },
            remove(obj){
                this.removeFrom(obj, this.all);
                this.removeFrom(obj, this.blocking);
                this.removeFrom(obj, this.pawns);
                this.removeFrom(obj, this.physics);
                this.removeFrom(obj, this.bullets);
                this.removeFrom(obj, this.damageable);
            },
            removeFrom(obj, arr){
                const i = arr.indexOf(obj);
                if(i != -1) arr.splice(i, 1); 
            },
            indexOf(obj){
            	return this.all.indexOf(obj);
            },
            cleanup(){
                for(let i=this.all.length-1; i>= 0; i--){
                    const obj = this.all[i];
                    if(obj.dead || (this.all[i].pawn && this.all[i].pawn.dead)) this.remove(obj);
                }
            },
            all:[],
            blocking:[],
            pawns:[],
            physics:[],
            bullets:[],
            damageable:[],
        };


        this.particles=[];
		this.modals=[];
		this.player=new PlayerController();
        this.cam=new Camera();
        this.cam.target=this.player.pawn;
        this.cam.updateTargetXY(true);
	}
	draw(gfx){
        game.view.fill("#888");

        this.cam.drawStart(gfx);
        this.objs.all.forEach(o => o.draw(gfx));
        this.particles.forEach(p => p.draw(gfx));
        this.cam.drawEnd(gfx);
        
        this.modals.forEach(m => m.draw(gfx));
    }
    updateModals(){

        const result = {
            zoom:1,
            hasPause:false,
            sceneFrozen:false,
        };

        for(let i = this.modals.length - 1; i >= 0; i--){
            const modal = this.modals[i];
            if(modal.isPause) result.hasPause = true;
            if(!result.sceneFrozen){
                modal.update();
                if(modal.blocksSceneInput) {
                    result.sceneFrozen = true;
                    result.zoom = modal.zoom;
                }
                if(modal.remove) this.modals.splice(i, 1);
            }
        }
        return result;
    }
	update(){

        const res = this.updateModals();

        if(!res.sceneFrozen){
            // update all objects
            this.objs.all.forEach(o => o.update());


            // update particles:
    		for(var i in this.particles){
                this.particles[i].update();
                if(this.particles[i].dead)this.particles.splice(i,1);
            }

            // do collision detection:
            this.objs.blocking.forEach(b=>{
                b.block(this.objs.pawns);
                b.block(this.objs.physics);
            });
            this.objs.bullets.forEach(b=>{
                b.overlap(this.objs.blocking);
                b.overlap(this.objs.pawns);
            });
            this.objs.physics.forEach(i=>{
                i.overlap(this.objs.pawns);
            });

            // remove all objects marked as "DEAD"
            this.objs.cleanup();
        }
        // update camera
        this.cam.update( res.zoom);

        return res;
    }
    modal(modal){

    	const types = this.modals.map(m => Object.getPrototypeOf(m));
    	const typeAlreadyExists = types.includes(Object.getPrototypeOf(modal));

    	if (typeAlreadyExists) return;

    	this.modals.push(modal);
    }
}