function Quest(raw={}){
	this.title=raw.t||"";
	this.callbacks={
		onCheck:Callback.from(raw.onCheck),
		onComplete:Callback.from(raw.onDone),
	}; raw.r||[{}];// a callback list (like onData)
	this.feedback=raw.f||[];
	this.serialize=function(){
		return {
			t:this.title,
			r:this.req,
			f:this.feedback
		};
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
        if(!Array.isArray(text))text=[text];
        text.forEach(t=>consoleObj.log("// "+t));
	};
	this.check=function(){
		var completed=true;
		this.callbacks.onCheck.forEach(c=>{
			if(!Callback.do(c))completed=false;
		});
		if(completed){
			Callback.do(this.callbacks.onDone);
            this.comment(this.feedback, true);
		}
	};
}