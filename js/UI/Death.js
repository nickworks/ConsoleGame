function Death(){

    this.font=new Font({size:12,color:"#FFF",align:"center"});

    this.timer=.5;
	this.update=function(dt){
        this.timer-=dt;

        if(keyboard.onDown(key.any())){
            this.reloadLevel=true;
        }
    };
    this.draw=function(gfx){
        var p=1-(this.timer/.5);
        if(p<0)p=0;
        if(p>1)p=1;
        p*=.9;
        game.clear("rgba(0,0,0,"+p+")");
        this.font.color="rgba(255,255,255,"+p+")";
        this.font.apply(gfx);
        gfx.fillText("You are dead, man.", game.width()/2,game.height()/2);
        gfx.fillText("Press ENTER", game.width()/2,game.height()/2+15);
    };
}