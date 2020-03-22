const sfx={
	soundbank:{
		"shotgun1":{
			url:"audio/shotgun1.ogg"
		},
		"smg":{
			url:["audio/smg1.ogg","audio/smg2.ogg","audio/smg3.ogg"]
		},
		"pistol":{
			url:"audio/pistol1.ogg"
		},
		"rifle":{
			url:"audio/rifle1.ogg"
		},
		"rocket":{
			url:"audio/rocketlauncher.ogg"
		},
		"outofammo":{
			url:"audio/outofammo.ogg"
		},
		"explosion":{
			url:"audio/explosion.ogg"
		},
	},
	soundsLoaded:false,
	audio:new AudioContext(),
	masterGain:null,
	play(str){
		const sound=this.soundbank[str];
		if(!sound)return;
		if(sound.buffers){
			this.audio.resume().then(()=>{
				
				const i = parseInt(Math.random() * sound.buffers.length);
				const buff=sound.buffers[i];

				const source = this.audio.createBufferSource();
				source.buffer = buff;
				source.playbackRate.value = game.time.scale;
				source.detune.value = Maths.rand(-600,600);
				source.connect(this.masterGain);
				source.start(0);
				// this callback will be called when the game's speed changes:
				const rateCallback=(e)=>{
					source.playbackRate.value=game.time.scale;
				};
				// when the sound is done playing, do some cleanup:
				source.onended=function(){
					document.removeEventListener("rateChange",rateCallback);
					source.onended=false;
				};
				// add listener:
				document.addEventListener("rateChange",rateCallback);


			});
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

			if(!Array.isArray(sound.url)) sound.url=[sound.url];

			sound.url.forEach(url=>{
				const req = new XMLHttpRequest();
				req.open('GET', url, true);
				req.responseType = 'arraybuffer';
				req.onload = function() {
					audio.decodeAudioData(req.response, (buff)=> {
						if(!Array.isArray(sound.buffers))sound.buffers=[];
						sound.buffers.push(buff);
					});
				};
				req.send();
			});
		}
	},
};