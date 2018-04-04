let scene=null;
let game=new Game();
function Game(){
    
    var timePrev=0;
    var dt=0;
    var currentScene=null;
    var width=0;
    var height=0;
    var gfx=null;
    
    var targetSize={w:800,h:400};
    var isFullscreen=false;

    var canvas=null;
    this.width=function(){return width;}
    this.height=function(){return height;}
    this.gfx=function(){return gfx;}
    
    Game.DEVMODE=false;
    this.settings={
        skipLoadingScenes:Game.DEVMODE||false,
        editModeEnabled:Game.DEVMODE||false,
    };
    
    this.calcDeltaTime=function(time){
        if(time === undefined) time = 0;
        dt = (time - timePrev) / 1000;
        timePrev = time;
    };
    this.update=function(time){
        
        if(targetSize){
            console.log("RESIZE FROM LOOP");
            this.size(targetSize.w,targetSize.h);
            targetSize=null;
        }
        
        this.calcDeltaTime(time);
        
        if(keyboard.onDown(key.console())){
            //if(scene.pause)scene.pause();
            keyboard.blur();
            consoleObj.input.focus();
        }
        
        let nextScene;
        scene=currentScene;
        game=this;
        
        if(currentScene){
            nextScene=currentScene.update(dt);
            currentScene.draw(gfx);
            if(!this.isFocus()){
                gfx.fillStyle="rgba(0,0,0,.5)";
                gfx.fillRect(0,0,width,height);
            }
        } else {
            nextScene=new SceneTitle();
        }
        
        if(nextScene)currentScene=nextScene;
        
        ///////////////////////////// LATE UPDATE:
        keyboard.update();
        mouse.update();
        requestAnimationFrame((time)=>this.update(time));
    };
    this.isFocus=()=>{return(document.activeElement==document.body)};
    this.fullscreen=function(fs){
        isFullscreen=fs||!isFullscreen;
        if(!isFullscreen){
            targetSize={w:800,h:400};
            canvas.style.marginTop="50px";
        }
        else {
            targetSize={w:document.body.clientWidth,h:window.innerHeight-150};
            canvas.style.marginTop="0";
        }
    };
    this.size=function(w,h){
        width=canvas.width=w;
        height=canvas.height=h;
    };
    
    this.clear=function(color="#000"){
        gfx.fillStyle=color;
        gfx.fillRect(0, 0, width, height); // clear screen
    };
    this.loadLevel=function(n){
        scene=currentScene=new ScenePlay(n);  
    };
    this.start=function(id){
        canvas=document.getElementById(id);
        if(canvas==undefined) return;
        gfx=canvas.getContext("2d");
        if(gfx==undefined) return;
        
        window.addEventListener("blur",()=>{
            if(scene&&scene.pause)scene.pause();
            keyboard.blur();
        });
        window.addEventListener("resize",(e)=>{
            if(isFullscreen)this.fullscreen(true);
        });
        
        keyboard.setup();
        mouse.setup(canvas, this);
        
        sprites.init(gfx);
        this.update(0); // begin game loop
    };
}