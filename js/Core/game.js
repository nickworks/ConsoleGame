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
    this.loadLevel=function(n){
        scene=currentScene=new ScenePlay(n);  
    };
    this.start=function(id){
        const canvas=document.getElementById(id);
        if(canvas==undefined) return;
        gfx=canvas.getContext("2d");
        if(gfx==undefined) return;
        
        createBetterMatrixMath();
        
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
    function createBetterMatrixMath(){
        //okay, it only does translate...
        //but it DOES allow me to push/pop transform matrices
        gfx.matrices=[[0,0]];
        gfx.getMatrix=function(){
            return this.matrices[this.matrices.length-1];
        };
        gfx.translate=function(x,y){
            if(this.matrices.length<=1)return;
            const m=this.getMatrix();
            m[0]+=x;
            m[1]+=y;
            this.applyMatrix();
        };
        gfx.applyMatrix=function(){
            var x=0;
            var y=0;
            this.matrices.forEach(m=>{
                x+=m[0];
                y+=m[1];
            });
            this.setTransform(1, 0, 0, 1, x, y);
        };
        gfx.beginTransform=function(){
            this.matrices.push([0,0]);
        };
        gfx.endTransform=function(){
            if(this.matrices.length>1){
                this.matrices.pop();
            }
            this.applyMatrix();
        };       
        
    }
}
