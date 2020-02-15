class Game {
    constructor(){

        Game.DEVMODE=true;

        this.time={
            now:0,
            prev:0,
            dt:0,
            tick:(t)=>{
                if(t === undefined) t = 0;
                this.time.now = t;
                this.time.dt = (t - this.time.prev) / 1000;
                this.time.prev = t;
                this.update();
            }
        }
        this.view={
            size:{w:800,h:500},
            cachedSize:{w:0,h:0},
            canvas:null,
            gfx:null,
            isFullscreen:false,
            make:function(id){
                this.canvas=document.getElementById(id);
                if(this.canvas==undefined) return false;
                this.gfx=this.canvas.getContext("2d");
                if(this.gfx==undefined) return false;
                return true;
            },
            clear:function(color="#000"){
                this.gfx.fillStyle=color;
                this.gfx.fillRect(0, 0, this.size.w, this.size.h); // clear screen
            },
            fullscreen:function(fs){
                this.isFullscreen=fs||!this.isFullscreen;
                if(!this.isFullscreen){
                    this.size={w:800,h:400};
                    this.canvas.style.marginTop="50px";
                }
                else {
                    this.size={w:document.body.clientWidth,h:window.innerHeight-150};
                    this.canvas.style.marginTop="0";
                }
            },
            resizeCanvas(){
                if(this.size.w != this.cachedSize.w || this.size.h != this.cachedSize.h){
                    this.cachedSize.w=this.canvas.width=this.size.w;
                    this.cachedSize.h=this.canvas.height=this.size.h;
                }
            }
        }
        this.scene=null;

        this.settings={
            skipLoadingScenes:Game.DEVMODE||false,
            editModeEnabled:Game.DEVMODE||false,
        };
    }

    width(){return this.view.size.w;}
    height(){return this.view.size.h;}
    gfx(){return this.view.gfx;}

    
    update(){
        
        this.view.resizeCanvas();
        
        if(keyboard.onDown(key.console())) this.focusConsole();
        
        this.globals();

        this.updateScene();
        
        this.draw();

        this.lateUpdate();
    }
    focusConsole(){
        keyboard.blur();
        consoleObj.input.focus();
    }
    globals(){
        scene=this.scene;
        game=this;
    }
    updateScene(){
        let nextScene = (this.scene)
            ? this.scene.update(this.time.dt)
            : new SceneTitle();

        if(nextScene) this.scene=nextScene;
    }
    draw(){
        if(this.scene) this.scene.draw(this.view.gfx);
        const focusedOnConsole = (document.activeElement!=document.body);
        if(focusedOnConsole){
            this.view.gfx.fillStyle="rgba(0,0,0,.5)";
            this.view.gfx.fillRect(0,0,this.view.size.w,this.view.size.h);
        }
    }
    lateUpdate(){
        keyboard.update();
        mouse.update();

        // queue up the next frame for rendering:
        requestAnimationFrame((timestamp)=>this.time.tick(timestamp));
    }
    loadLevel(n){
        scene=this.scene=new ScenePlay(n);  
    }
    start(id){
        this.view.make(id);
        
        window.addEventListener("blur",()=>{
            if(scene&&scene.pause)scene.pause();
            keyboard.blur();
        });
        window.addEventListener("resize",(e)=>{
            if(this.view.isFullscreen)this.view.fullscreen(true);
        });
        
        keyboard.setup();
        mouse.setup(this.view.canvas, this);
        
        sprites.init(this.view.gfx);
        this.update(0); // begin game loop
    }
}

let scene=null;
let game=new Game();