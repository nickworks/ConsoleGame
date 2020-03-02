class Scene {
	constructor(){
		this.objs={
			get(i){
				return this.all[i]||{};
			},
			getUnderMouse(){
				let obj = null;
				this.all.forEach(o=>{
					if(o.rect.mouseOver())obj=o; 
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
                this.hazards =[];
			},
            add(obj){
                this.all.push(obj);
                switch(obj.constructor.name){
                    case "Platform":
                    case "Door":
                        this.blocking.push(obj);
                        break;
                    case "Pawn":
                        this.pawns.push(obj);
                        this.damageable.push(obj);
                        break;
                    case "Crate":
                        this.blocking.push(obj);
                        this.damageable.push(obj);
                        break;
                    case "Item":
                        this.physics.push(obj);
                        break;
                    case "Bullet":
                        this.bullets.push(obj);
                        break;
                    case "ProximityMine":
                        this.damageable.push(obj);
                        this.hazards.push(obj);
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
                this.removeFrom(obj, this.hazards);
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
                    if(obj.dead) this.remove(obj);
                }
            },
        };
        this.objs.clear();
        this.guis={
            overlays:[],
            modals:[],
            death:null,
            editor:null,
            pause:null,
        };
        this.particles=[];
		
		this.player=new PlayerController();
        this.cam=new Camera();
        
	}
    pause(){
        if(this.guis.editor) return;
        this.guis.pause = new Pause();
    }
    unpause(){
        this.guis.pause = null;
    }
	draw(){
        game.view.fill("#888");

        this.cam.drawStart();
        this.objs.all.forEach(o => o.draw());
        this.particles.forEach(p => p.draw());
        this.cam.drawEnd();
        

        // GUI OVERLAYS:
        this.guis.overlays.forEach(m => m.draw());
        this.guis.modals.forEach(m => m.draw());
        if(this.guis.pause) this.guis.pause.draw();
        if(this.guis.editor) this.guis.editor.draw();
        if(this.guis.death) this.guis.death.draw();
    }
	update(){

        if(this.guis.editor) {
            this.guis.editor.update();
            return true;
        }

        if(this.guis.pause) {
            this.guis.pause.update();
            return true;
        }

        
        if(this.guis.modals.length == 0){
            // update all objects
            this.objs.all.forEach(o => o.update());

            this.doCollisionDetection();

            // remove all objects marked as "DEAD"
            this.objs.cleanup();


            // update particles:
            this.reverseIterate(this.particles, (o, i) =>{
                o.update();
                if(o.dead) this.particles.splice(i,1);
            });
            this.reverseIterate(this.guis.overlays, (o, i)=>{
                o.update();
                if(o.dead) this.guis.overlays.splice(i,1);
            });
        } else {
            this.reverseIterate(this.guis.modals, (o, i)=>{
                o.update();
                if(o.dead) this.guis.modals.splice(i,1);
            });
        }

        // update camera
        this.cam.update();

        if(this.guis.death){
            this.guis.death.update();
            return true;
        }

        
        return false;
    }
    reverseIterate(arr, f){
        for(var i = arr.length - 1; i >= 0; i--){
            f(arr[i], i);
        }
    }
    doCollisionDetection(){
        // do collision detection:
        this.objs.blocking.forEach(b=>{ // allow blocking volumes to push out:
            b.block(this.objs.pawns);
            b.block(this.objs.physics);
        });
        this.objs.bullets.forEach(b=>{ // check if bullets overlap with:
            b.overlap(this.objs.blocking);
            b.overlap(this.objs.pawns) 
        });
        this.objs.physics.forEach(i=>{ // check if physics objects overlap with:
            i.overlap(this.objs.pawns);
        });
        this.objs.hazards.forEach(i=>{ // check if physics objects overlap with:
            i.overlap(this.objs.pawns);
        });
    }
    modal(modal){

    	const types = this.guis.modals.map(m => Object.getPrototypeOf(m));
    	const typeAlreadyExists = types.includes(Object.getPrototypeOf(modal));

    	if (typeAlreadyExists) return;

    	this.guis.modals.push(modal);
    }
    removeModal(modal){

        var i = this.guis.modals.indexOf(modal);
        this.guis.modals.slice(i,1);
    }
}