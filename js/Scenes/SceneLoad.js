function SceneLoad(){
    
    var tips=[
        "Wanna resize the game? Try calling game.size()"
    ];
    this.tip=(Math.random()*tips.length)|0;
    this.life=0;
    this.update=function(dt){
        this.life+=dt;
    };
    this.draw=function(gfx){
        gfx.fillStyle="#000";
        gfx.fillRect(0,0,game.width(),game.height());
        
    };
}