class Death extends Modal {
    constructor(){
        super();
        this.font=new Font({size:12,color:"#FFF",align:"center"});
        this.timer=.5;
    }
	update(){
        this.timer-=game.time.dt;

        if(keyboard.onDown(key.any())){
            game.scene.startLevel();
            this.close();
        }
    }
    draw(gfx){
        var p=1-(this.timer/.5);
        if(p<0)p=0;
        if(p>1)p=1;
        p*=.9;
        game.view.fill("rgba(0,0,0,"+p+")");
        this.font.color="rgba(255,255,255,"+p+")";
        this.font.apply(gfx);
        gfx.fillText("You are dead, man.", game.width()/2,game.height()/2);
        gfx.fillText("Press ENTER", game.width()/2,game.height()/2+15);
    }
}