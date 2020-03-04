// this scene is a "loading" scene that simulates a level downloading
// why bother?
// 1. this scene is part of the meta game (can be hacked / improved by player)
// 2. this scene is a valuable way early on to show the player the keyboard controls
// 3. tips, hints, easter eggs, etc.
// To disable this scene turn on Game.DEVMODE
class SceneLoad {

    // to serve up a game scene do this:
    // SceneLoad.Load(nextScene)
    static Level(n, pos={x:0,y:0}, speed=1){
        
        speed = +speed;

        const scene = new ScenePlay();
        scene.fromLevel(n, pos);
        
        return new SceneLoad(scene, speed|1);
    }


    constructor(nextScene,speed=1){
        this.tips=[
            "Wanna resize the game? Try calling game.size()",
            "If you're stuck, check out the awful tutorial.",
            "Press TAB to switch between the game and the console.",
            "You can look up data in an array by using an index number inside square brackets: scene.platforms[0]",
            "When calling functions, make sure you have parentheses after the name: game.size()",
            "Objects begin and end with curly braces: {value: 42}",
            "You can access a value in an object by using a period:  `scene.player`",
            "Don't like this game's controls? Feel free to change the input mappings in the `key` object",
            "The most important object is `scene`, but you may be able to find others!",
            "Press F11 to go fullscreen!",
            "Try out game.view.fullscreen()"
        ];
        this.nextScene=nextScene; // what scene to display after this "loading" scene
        this.speed=speed|1; // a multiplier for how fast the progress bar loads
        this.tip=(Math.random()*this.tips.length)|0; // a random text to display
        this.percent=0; // the current value of the progress bar
        this.delay=0; // how long to wait before "loading" another chunk of data
        this.font=new Font({color:"#FFF",align:"center"}); // what font to use
    }
    update(){
        if(game.settings.skipLoadingScenes || Game.DEVMODE) this.loadNextScene();
        
        else if(this.delay>0){

            this.delay-=game.time.dt;

        } else {

            const rand=(v=1)=>{return Math.random()*v;};
            if(rand()<.01) this.delay=rand(.2);
            this.percent+=rand(this.speed/200);

            if(this.percent>=1) this.loadNextScene();
        }
    }
    draw(){
        game.view.fill("#555");
        
        var w=(game.width())*(this.percent>1?1:this.percent);
        gfx.fillStyle="#9AF";
        gfx.fillRect(0,game.height()-10,w,10);
        
        //this.font.color="rgba(255,255,255,"+Math.min(this.alpha, 1)+")";
        this.font.apply();
        gfx.fillText(this.tips[this.tip],game.width()/2,game.height()-25);
        
        var x=(game.width()-sprites.input.width)/2;
        gfx.drawImage(sprites.input, x, 20);
        
    }
    loadNextScene(){
        game.switchScene(this.nextScene);
    }
}