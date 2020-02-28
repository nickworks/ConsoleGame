class Modal {
	constructor(){ }
	close(){
		scene.cam.goals.scale=1;
		this.dead=true; // call close() on a modal to mark it as dead
	}
}