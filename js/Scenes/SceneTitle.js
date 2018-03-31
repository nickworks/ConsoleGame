function SceneTitle(){
    var alphaOverlay=1;
    var fadeToScene=null;
    this.title=new TextField("open source", 20, 50, {size:30,color:"#9AF"});
    
    this.menu = new Menu(0,100,game.width(),32,[
        {caption:"Play",callback:()=>{fadeToScene=new SceneLoad(new ScenePlay(0));}},
        {caption:"Tutorial",callback:()=>{consoleObj.log("Coming soon!")}},
        {caption:"About",callback:()=>{consoleObj.log("Game by Nick Pattison")}}
    ]);
    
    this.update = function(dt){
        if(fadeToScene){
            if(alphaOverlay<1)alphaOverlay+=dt*4;
            else return fadeToScene;
        } else if(alphaOverlay>0)alphaOverlay-=dt*2;
        this.menu.update(dt);
    };
    this.draw = function(gfx){
        game.clear("#555");
        this.title.draw(gfx);
        this.menu.draw(gfx);
        gfx.fillStyle="rgba(0,0,0,"+alphaOverlay+")";
        gfx.fillRect(0,0,game.width(),game.height());
    };
    
    Player.data={};
}