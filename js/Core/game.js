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
            scale:1,
            _dt:0,
            tick:(t)=>{
                if(t === undefined) t = 0;
                this.time.now = t;
                this.time._dt = (t - this.time.prev) / 1000;
                this.time.dt = this.time._dt * this.time.scale;
                this.time.prev = t;
                Game.Repair(this);
                this.update();
            },
            // these are used in DEVMODE:
            delayUpdateFPS:0,
            frameRate:0,
        }
        // game.view
        // This section controls the size of the viewport,
        // and it has refences to the canvas element
        // and to the graphics renderer
        this.view={
            size:{w:800,h:500},
            cachedSize:{w:0,h:0},
            canvas:null,
            gfx:null,
            isFullscreen:false,
            alphaOverlay:1,
            // get the canvas and drawing context by using a provided id
            make(id){
                this.canvas=document.getElementById(id);
                if(this.canvas==undefined) return false;
                this.gfx=this.canvas.getContext("2d");
                if(this.gfx==undefined) return false;


                this.gfx.fillCircle=(x,y,r)=>{
                    this.gfx.beginPath();
                    this.gfx.ellipse(x,y,r,r,0,0,Math.PI*2);
                    this.gfx.fill();
                };

                return true;
            },
            // fade in or out, returns true when done
            fade(isDark){

                if(Game.DEVMODE) return true;

                const dif = (isDark ? -1 : 1) * game.time.dt;
                let a = this.alphaOverlay + dif;

                if(a<0) a = 0;
                if(a>1) a = 1;

                this.fill("rgba(0,0,0,"+a+")");
                this.alphaOverlay = a;

                if(isDark && a == 0) return true;
                if(!isDark && a == 1) return true;

                return false;
            },
            // fills the screen with a specified color
            fill(color="#000"){
                this.gfx.fillStyle=color;
                this.gfx.fillRect(0, 0, this.size.w, this.size.h); // clear screen
            },
            // toggles fullscreen, optional parameter
            fullscreen(fs){
                this.isFullscreen=fs||!this.isFullscreen;
                if(!this.isFullscreen){
                    document.exitFullscreen();
                    this.size={w:800,h:400};
                    this.canvas.style.marginTop="50px";
                }
                else {
                    document.documentElement.requestFullscreen();
                    this.size={w:document.body.clientWidth-50,h:window.innerHeight-150};
                    this.canvas.style.marginTop="15px";
                }
            },
            resizeCanvas(){
                if(this.size.w != this.cachedSize.w || this.size.h != this.cachedSize.h){
                    this.cachedSize.w=this.canvas.width=this.size.w;
                    this.cachedSize.h=this.canvas.height=this.size.h;
                }
            }
        }
        // reference to the console
        this.console=new Console();
        // reference to the current scene
        this.scene=null;
        // reference to the next scene (so we can fade between the two scenes)
        this.nextScene=null;

        // meta-game stuff here:
        this.settings={
            skipLoadingScenes:false,
            editModeEnabled:false,
        };
    }

    // returns the width of the viewport
    width(){return this.view.size.w;}

    // returns the height of the viewport
    height(){return this.view.size.h;}

    // returns view.gfx
    gfx(){return this.view.gfx;}

    
    update(){

        this.view.resizeCanvas(); // if the canvas needs resizing, do it
        
        // if the console button is pressed, switch focus to console mode:
        if(keyboard.onDown(key.console())) this.focusConsole();
        
        // update global values:
        this.globals();

        if(this.scene){
            this.scene.update();
            this.draw(); // draw current scene + overlay(s)
        } else {
            this.scene=new SceneTitle(); // if no scene, default to sceneTitle
        }
        

        this.lateUpdate();
    }
    focusConsole(){
        keyboard.blur();
        this.console.input.focus();
    }
    // for convenience and to protect the player early on, make global references:
    globals(){
        window.scene=this.scene;
        window.obj = (i) => {return scene.objs.get(i);};
        window.player=(this.scene==undefined)?null:this.scene.player;
        window.game=this;
        window.gfx=this.view.gfx;
    }
    draw(){
        this.scene.draw();
        if(Game.DEVMODE) this.drawDev();
        

        // if focused on console (input is not going to game)
        if(document.activeElement!=document.body) this.view.fill("rgba(0,0,0,.5)");
        
    }
    drawDev(){
        this.time.delayUpdateFPS -= this.time._dt;
        if(this.time.delayUpdateFPS <= 0) {
            this.time.frameRate = parseInt(1.0/this.time._dt);
            this.time.delayUpdateFPS=.5;
        }
        gfx.font="10pt Courier";
        gfx.textAlign="center";
        gfx.textBaseline="middle";
        gfx.fillStyle="rgba(0,0,0,.8)";
        gfx.fillRect(0,0,25,18);
        gfx.fillStyle="#FFF";
        gfx.fillText(this.time.frameRate,12,10);
    }
    switchScene(nextScene){
        this.nextScene = nextScene;
    }
    lateUpdate(){

        // this draws a fade overtop of everything
        // which is why it's in lateUpdate()
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