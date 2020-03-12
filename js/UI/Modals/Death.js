class Death extends Modal {
    constructor(){
        super();
        this.font=new Font({size:12,color:"#FFF",align:"center"});
        this.age=0;
    }
	update(){
        if(this.scale<2)this.scale+=.2*game.time._dt;
        if(this.angle<1)this.angle+=.02*game.time._dt;
        if(game.time.scale>.1)game.time.scale-=.1*game.time._dt;
        if(this.age<3)this.age+=game.time._dt;
        else if(keyboard.onDown(key.any())){
            game.scene.reloadScene();
            this.close();
        }
    }
    draw(){
        var p=(this.age/2);
        if(p<0)p=0;
        if(p>1)p=1;
        p*=.5;
        game.view.fill("rgba(0,0,0,"+p+")");
        this.font.color="rgba(255,255,255,"+(p*2)+")";
        this.font.apply();
        gfx.fillText("You are dead, man.", game.width()/2,game.height()/2);
        gfx.fillText("Press ENTER", game.width()/2,game.height()/2+15);
    }
}