function ScenePlay(){
    
    
    this.update = function(dt){
        
    };
    this.draw = function(gfx){
        var x = Math.random() * game.width;
        var y = Math.random() * game.height;
        var hue = parseInt(Math.random() * 360);
        gfx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        gfx.beginPath();
        gfx.ellipse(x,y,50,50,0,0,Math.PI * 2, false);
        gfx.closePath();
        gfx.fill();
    };
}