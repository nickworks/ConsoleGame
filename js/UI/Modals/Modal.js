class Modal {
	constructor(x=0,y=0,scale=1,angle=0){
		this.x=x;
		this.y=y;
		this.angle=angle;
		this.scale=scale;
		this.offset={
			x:0,
			y:0,
		};
	}
	close(){
		this.dead=true; // call close() on a modal to mark it as dead
	}
}