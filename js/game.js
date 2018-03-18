let level = null;
const game = {
    timePrev: 0,
    dt: 0,
    gfx:undefined,
    width:500,
    height:400,
    scene:undefined,
    begin:function(id){
        
        const canvas = document.getElementById(id);
        if(canvas == undefined) return;
        this.gfx = canvas.getContext("2d");
        if(this.gfx == undefined) return;
        this.width = canvas.width;
        this.height = canvas.height;
        
        keyboard.setup();
        mouse.setup(canvas);
        
        this.update(0); // begin game loop
    },
    calcDeltaTime:function(time){
        if(time === undefined) time = 0;
        this.dt = (time - this.timePrev) / 1000;
        this.timePrev = time;
    },
    update:function(time){
        this.calcDeltaTime(time);
        let nextScene;
        
        if(this.scene){
            nextScene = this.scene.update(this.dt);
            this.scene.draw(this.gfx);
        } else {
            nextScene = new SceneTitle();
        }
        
        if(nextScene){
            this.scene = nextScene;
            level = nextScene;
        }
        
        ///////////////////////////// LATE UPDATE:
        keyboard.update();
        requestAnimationFrame((time) => this.update(time));
    },
    clear:function(){
        this.gfx.clearRect(0, 0, this.width, this.height); // clear screen
    }
};

game.begin("myCanvas");