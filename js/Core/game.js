class Game {
    constructor(){


        Game.DEVMODE=true;

        this.timePrev=0;
        this.dt=0;
        this.currentScene=null;
        this.w=0;
        this.h=0;
        this.graphics=null;
        this.targetSize={w:800,h:400}; // how big the play window should be
        this.isFullscreen=false;
        this.canvas=null;

        this.settings={
            skipLoadingScenes:Game.DEVMODE||false,
            editModeEnabled:Game.DEVMODE||false,
        };
    }
    calcDeltaTime(time){
        if(time === undefined) time = 0;
        this.dt = (time - this.timePrev) / 1000;
        this.timePrev = time;
    }

    width(){return this.w;}
    height(){return this.h;}
    gfx(){return this.graphics;}

    resizeCanvas(){ // if the canvas has a resize queued-up, resize it
        if(this.targetSize){
            this.size(this.targetSize.w,this.targetSize.h);
            this.targetSize=null;
        }
    }
    update(time){
        
        this.resizeCanvas();

        this.calcDeltaTime(time);
        
        if(keyboard.onDown(key.console())){
            //if(scene.pause)scene.pause();
            keyboard.blur();
            consoleObj.input.focus();
        }
        
        let nextScene;
        scene=this.currentScene;
        game=this;
        
        if(this.currentScene){
            nextScene=this.currentScene.update(this.dt);
            this.currentScene.draw(this.graphics);
            if(!this.isFocus()){
                this.graphics.fillStyle="rgba(0,0,0,.5)";
                this.graphics.fillRect(0,0,this.w,this.h);
            }
        } else {
            nextScene=new SceneTitle();
        }
        
        if(nextScene)this.currentScene=nextScene;
        
        ///////////////////////////// LATE UPDATE:
        keyboard.update();
        mouse.update();
        requestAnimationFrame((time)=>this.update(time));
    }
    isFocus(){
        return(document.activeElement==document.body);
    }
    fullscreen(fs){
        this.isFullscreen=fs||!this.isFullscreen;
        if(!this.isFullscreen){
            this.targetSize={w:800,h:400};
            this.canvas.style.marginTop="50px";
        }
        else {
            this.targetSize={w:document.body.clientWidth,h:window.innerHeight-150};
            this.canvas.style.marginTop="0";
        }
    }
    size(w,h){
        this.w=this.canvas.width=w;
        this.h=this.canvas.height=h;
    }
    
    clear(color="#000"){
        this.graphics.fillStyle=color;
        this.graphics.fillRect(0, 0, this.w, this.h); // clear screen
    }
    loadLevel(n){
        scene=this.currentScene=new ScenePlay(n);  
    }
    start(id){
        this.canvas=document.getElementById(id);
        if(this.canvas==undefined) return;
        this.graphics=this.canvas.getContext("2d");
        if(this.graphics==undefined) return;
        
        window.addEventListener("blur",()=>{
            if(scene&&scene.pause)scene.pause();
            keyboard.blur();
        });
        window.addEventListener("resize",(e)=>{
            if(this.isFullscreen)this.fullscreen(true);
        });
        
        keyboard.setup();
        mouse.setup(this.canvas, this);
        
        sprites.init(this.graphics);
        this.update(0); // begin game loop
    }
}

let scene=null;
let game=new Game();