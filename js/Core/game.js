class Game {

    static DEVMODE = true;

    static Repair(obj){

        const prototype = Object.getPrototypeOf(obj);
        const funcnames = Object.getOwnPropertyNames(prototype).filter(p => (typeof prototype[p]) === 'function');
        
        funcnames.forEach(f => {
            if((typeof obj[f]) != 'function'){
                game.console.log("/* Careful there!\n * "+f+"() is a function.\n * Changing a function can introduce bugs that CRASH\n * THE GAME. There may not be any coming back from a crashed game...\n * so be careful! Perhaps you should visit the Western guru to\n * learn more about functions.\n */");
                obj[f] = prototype[f];
            } 
        });

    }


    constructor(){

        this.time={
            now:0,
            prev:0,
            dt:0,
            tick:(t)=>{
                if(t === undefined) t = 0;
                this.time.now = t;
                this.time.dt = (t - this.time.prev) / 1000;
                this.time.prev = t;
                Game.Repair(this);
                this.update();
            }
        }
        this.view={
            size:{w:800,h:500},
            cachedSize:{w:0,h:0},
            canvas:null,
            gfx:null,
            isFullscreen:false,
            alphaOverlay:1,
            make:function(id){
                this.canvas=document.getElementById(id);
                if(this.canvas==undefined) return false;
                this.gfx=this.canvas.getContext("2d");
                if(this.gfx==undefined) return false;
                return true;
            },
            fade:function(isDark){

                if(Game.DEVMODE) return true;

                const dif = (isDark ? -1 : 1) * game.time.dt;
                let a = this.alphaOverlay + dif;

                if(a<0) a = 0;
                if(a>1) a = 1;

                this.clear("rgba(0,0,0,"+a+")");
                this.alphaOverlay = a;

                if(isDark && a == 0) return true;
                if(!isDark && a == 1) return true;

                return false;
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
        this.console=new Console();
        this.scene=null;
        this.nextScene=null;
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

        if(!this.scene) this.scene=new SceneTitle(); // if no scene, default to sceneTitle

        this.nextScene = this.scene.update(this.time.dt);

        this.draw(); // draw current scene + overlay(s)

        this.lateUpdate();
    }
    focusConsole(){
        keyboard.blur();
        this.console.input.focus();
    }
    globals(){
        scene=this.scene;
        game=this;
    }
    draw(){
        if(this.scene) this.scene.draw(this.view.gfx);

        // if focused on console (input is not going to game)
        if(document.activeElement!=document.body) this.view.clear("rgba(0,0,0,.5)");
        
    }
    lateUpdate(){

        const doneFading = this.view.fade(!this.nextScene);

        if(this.nextScene && doneFading) {
            this.scene = this.nextScene;
            this.nextScene = null;
        }

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