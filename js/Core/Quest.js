function Quest(raw={}){
	this.title=raw.t||"";
	this.callbacks={
		onData:raw.onData||[],
		onComplete:raw.onDone||[],
	}; raw.r||[{}];// a callback list (like onData)
	this.feedback=raw.f||[];
	this.serialize=function(){
		return {
			t:this.title,
			r:this.req,
			f:this.feedback
		};
	}
	this.addReq=function(o){
		this.req.push();
	};
	this.comment=function(text,praise=true){
		var p=[
			"// Level Up! //",
			"// ~ ~ ~ ~ ~ ~ ~ NICE JOB ~ ~ ~ ~ ~ ~ ~ //",
			"// XP++",
			"// onCrushinIt.call()",
			"// if(XP>9000){"
		];
		if(praise){
			const i=(Math.random()*p.length)|0;
			consoleObj.log(p[i]);
		}
		consoleObj.log(text);
	};
	this.check=function(){
		var completed=true;
		//for(var i in this.req){
		this.callbacks.onData.forEach(c=>{
			if(!scene.call(c))completed=false;
		});
		if(completed){
			scene.call(this.callbacks.onDone);
		}
	};
}