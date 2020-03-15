const Maths={
	// return a 2D vector of magnitude @s
	// which points in a random direction
	randDir(s=1){
        const a=Math.random()*Math.PI*2;
        return {
            x:s*Math.cos(a),
            y:s*Math.sin(a)
        };
    },
    // return a 2D value within a rectangle of size @w by @h
    // where 0,0 is the rectangle's center
    randBox(w=1,h=1){
        return {
            x:Math.random()*w-w/2,
            y:Math.random()*h-h/2
        };
    },
    rand(min,max){
        return Math.random()*(max-min)+min;
    },
    randBell(min,max,n=2){
    	const range = max-min;
    	let sum = 0;
    	for(let i = 0; i <n; i++){
	    	sum+=Math.random()*range/n;
	    }
	    return sum+min;
    },
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
	},
	clamp(c,min,max){
		if(c<min)c=min;
		if(c>max)c=max;
		return c;
	},
	magSq(a,b){
		const dx=a.x-b.x;
		const dy=a.y-b.y;
		return dx*dx+dy*dy;
	},
	mag(a,b){
		return Math.sqrt(this.magSq(a,b));
	}
};