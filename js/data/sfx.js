const sfx={
	soundbank:{
		"shotgun1":{
			url:"audio/shotgun1.ogg"
		}
	},
	soundsLoaded:false,
	audio:new AudioContext(),
	masterGain:null,
	play(str){
		const sound=this.soundbank[str];
		if(!sound)return;
		if(sound.play){
			this.audio.resume().then(()=>sound.play());
		}
	},
	update(){
		if(this.playbackRate!=game.time.scale){
			this.playbackRate=game.time.scale;

			document.dispatchEvent(new Event('rateChange'));
		}
		
	},
	loadSounds(){
		if(!this.audio) return;
		if(this.soundsLoaded) return;
		this.soundsLoaded=true;

		const audio = this.audio;

		this.masterGain=this.audio.createGain();
		this.masterGain.gain.value=.1;
		this.masterGain.connect(audio.destination);

		for(var key in this.soundbank){
			const sound = this.soundbank[key];

			const req = new XMLHttpRequest();
			req.open('GET', sound.url, true);
			req.responseType = 'arraybuffer';
			
			req.onload = function() {
				audio.decodeAudioData(req.response, (buff)=> {
					sound.play=()=>{
						const source = audio.createBufferSource();
						source.buffer = buff;
						source.playbackRate.value = game.time.scale;
						source.detune.value = Maths.rand(-600,600);
						source.connect(sfx.masterGain);
						source.start(0);
						const rateCallback=(e)=>{
							source.playbackRate.value=game.time.scale;
						};
						source.onended=function(){
							document.removeEventListener("rateChange",rateCallback);
							source.onended=false;
						};
						document.addEventListener("rateChange",rateCallback);
					};
				});
			}

			req.send();
		}
	},
};