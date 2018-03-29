let scene=null;
let game=new Game();
function Game(){
    var timePrev=0;
    var dt=0;
    var currentScene=null;
    var width=0;
    var height=0;
    var gfx=null;
    
    this.width=function(){return width;}
    this.height=function(){return height;}
    this.gfx=function(){return gfx;}
    
    this.settings={
        skipLoadingScenes:true,
        editModeEnabled:true,
    };
  
    this.calcDeltaTime=function(time){
        if(time === undefined) time = 0;
        dt = (time - timePrev) / 1000;
        timePrev = time;
    };
    this.update=function(time){
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
    this.clear=function(color="#000"){
        gfx.fillStyle=color;
        gfx.fillRect(0, 0, width, height); // clear screen
    };
    this.start=function(id){
        const canvas=document.getElementById(id);
        if(canvas==undefined) return;
        gfx=canvas.getContext("2d");
        if(gfx==undefined) return;
        
        this.size=function(w,h){
            width=canvas.width=w;
            height=canvas.height=h;
        };
        this.size(800,400);
        
        window.addEventListener("blur",()=>{
            if(scene&&scene.pause)scene.pause();
            keyboard.blur();
        });
        
        keyboard.setup();
        mouse.setup(canvas, this);
        
        sprites.init(gfx);
        this.update(0); // begin game loop
    };
}