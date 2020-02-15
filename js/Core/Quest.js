class Quest {
	constructor(raw={}){
		this.title=raw.t||"";
		this.callbacks={
			onCheck:Callback.from(raw.onCheck),
			onComplete:Callback.from(raw.onDone),
		}; raw.r||[{}];// a callback list (like onData)
		this.feedback=raw.f||[];
	}
	serialize(){
		return {
			t:this.title,
			r:this.req,
			f:this.feedback
		};
	}
	comment(text,praise=true){
		var p=[
			"// Level Up! //",
			"// ~ ~ ~ ~ ~ ~ ~ NICE JOB ~ ~ ~ ~ ~ ~ ~ //",
			"// XP++",
			"// onCrushinIt.call()",
			"// if(XP>9000){"
		];
		if(praise){
			const i=(Math.random()*p.length)|0;
			game.console.log(p[i]);
		}
        if(!Array.isArray(text))text=[text];
        text.forEach(t=>game.console.log("// "+t));
	}
	check(){
		var completed=true;
		this.callbacks.onCheck.forEach(c=>{
			if(!Callback.do(c))completed=false;
		});
		if(completed){
			Callback.do(this.callbacks.onDone);
            this.comment(this.feedback, true);
		}
	}
}