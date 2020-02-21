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
        this.guis={
            overlays:[],
            modals:[],
            editor:null,
            pause:null,
        };
        this.particles=[];
		
		this.player=new PlayerController();

        this.cam=new Camera();
        this.cam.target=this.player.pawn;
        this.cam.updateTargetXY(true);
	}
    pause(){
        if(this.guis.editor) return;
        this.guis.pause = new Pause();
    }
    unpause(){
        this.guis.pause = null;
    }
	draw(gfx){
        game.view.fill("#888");

        this.cam.drawStart(gfx);
        this.objs.all.forEach(o => o.draw(gfx));
        this.particles.forEach(p => p.draw(gfx));
        this.cam.drawEnd(gfx);
        

        // GUI OVERLAYS:
        this.guis.overlays.forEach(m => m.draw(gfx));
        this.guis.modals.forEach(m => m.draw(gfx));
        if(this.guis.pause) this.guis.pause.draw(gfx);
        if(this.guis.editor) this.guis.editor.draw(gfx);
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
        
        var zoom = 1;
        
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
                if(o.zoom) zoom = o.zoom;
                if(o.dead) this.guis.overlays.splice(i,1);
            });
        } else {
            this.reverseIterate(this.guis.modals, (o, i)=>{
                o.update();
                if(o.zoom) zoom = o.zoom;
                if(o.dead) this.guis.modals.splice(i,1);
            });
        }

        // update camera
        this.cam.update(zoom);
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