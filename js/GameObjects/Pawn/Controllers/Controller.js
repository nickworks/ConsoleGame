// The Controller represents consciousness. It's an abstract class inherited by PlayerControllerController and AIController.
class Controller {
	constructor(){
		this.wantsToJump=true;
		this.wantsToDash=false;
		this.wantsToCrouch=false; // whether or not this controller wants to be crouched
		this.wantsToMove=0; // which direction this controller wants to move

		this.weaponAccuracy=.5;
		this.canDoubleJump=true;
		this.canWallJump=()=>{return true;};
	}
	notify(){
		// notifies the controller to another controller's presence
	}
	die(){

	}
}