function SceneLoad(newScene,speed=1){
    var tips=[
        "Wanna resize the game? Try calling game.size()",
        "If you're stuck, check out the awful tutorial.",
        "Press TAB to switch between the game and the console.",
        "You can look up data in an array by using an index number inside square brackets: scene.platforms[0]",
        "When calling functions, make sure you have parentheses after the name: game.size()",
        "Objects begin and end with curly braces: {value: 42}",
        "You can access a value in an object by using a period:  `scene.player`",
        "Don't like this game's controls? Feel free to change the input mappings in the `key` object",
        "The most important object is `scene`, but you may be able to find others!",
        "Press F11 to go fullscreen!"
    ];
    this.tip=(Math.random()*tips.length)|0;
    var fadeToScene=null;
    var alphaOverlay=1;
    this.percent=0;
    this.delay=0;
    this.font=new Font({color:"#FFF",align:"center"});
    
    this.update=function(dt){
        if(game.settings.skipLoadingScenes)return newScene;
        if(fadeToScene){
            if(alphaOverlay<1)alphaOverlay+=4*dt;
            else return newScene;
        }else if(alphaOverlay>0)alphaOverlay-=dt;
        
        if(this.delay>0){
            this.delay-=dt;
        } else {
            const rand=(v=1)=>{return Math.random()*v;};
            this.percent+=rand(speed/200);
            if(this.percent>=1){
                fadeToScene=newScene;
                this.percent=1;
            }
            if(rand()<.01) this.delay=rand(.2);            
        }
    };
    this.draw=function(gfx){
        game.clear("#555");
        
        var w=(game.width())*(this.percent>1?1:this.percent);
        gfx.fillStyle="#9AF";
        gfx.fillRect(0,game.height()-10,w,10);
        
        //this.font.color="rgba(255,255,255,"+Math.min(this.alpha, 1)+")";
        this.font.apply(gfx);
        gfx.fillText(tips[this.tip],game.width()/2,game.height()-25);
        
        var x=(game.width()-sprites.input.width)/2;
        gfx.drawImage(sprites.input, x, 20);
        
        
        game.clear("rgba(0,0,0,"+alphaOverlay+")");
    };
}