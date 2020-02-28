const Maths={
	lerp(a, b, p){
		return (b-a)*p+a;
	},
	map(v, a, b, c, d){
		let p = (v-a)/(b-a);
		return Maths.lerp(c,d,p);
	},
	// this function uses dt to calculate
	// a framerate-independent PERCENT value (P)
	// that can then be used like: lerp(current, target, P)
	slide(pa1s, dt){
		if(!!dt)dt=game.time.dt;
		return 1 - Math.pow(pa1s, dt);
	}
};