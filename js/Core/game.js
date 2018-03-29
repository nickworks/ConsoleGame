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
        editModeEnabled:true,
    };
    
    this.calcDeltaTime=function(time){
        if(time === undefined) time = 0;
        dt = (time - timePrev) / 1000;
        timePrev = time;
    };
    this.update=function(time){
        this.calcDeltaTime(time);
        let nextScene;
        scene=currentScene;
        game=this;
        
        if(currentScene){
            nextScene=currentScene.update(dt);
            currentScene.draw(gfx);
        } else {
            nextScene=new SceneTitle();
        }
        
        if(nextScene)currentScene=nextScene;
        
        ///////////////////////////// LATE UPDATE:
        keyboard.update();
        mouse.update();
        requestAnimationFrame((time)=>this.update(time));
    };
    this.clear=function(){
        gfx.clearRect(0, 0, width, height); // clear screen
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
        this.size(500,400);
        
        window.addEventListener("blur",()=>{if(scene&&scene.player&&!scene.modal)scene.modal=new Pause();});
        
        keyboard.setup();
        mouse.setup(canvas, this);
        
        sprites.init(gfx);
        this.update(0); // begin game loop
    };
}