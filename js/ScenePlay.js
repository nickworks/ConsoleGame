function ScenePlay(){
    this.player = new Player();
    this.platforms = [
        new Platform(new Rect(5,250,200,30)),
        new Platform(new Rect(210,200,200,30)),
    ];
    
    this.update = function(dt){
        this.player.update(dt);
        this.platforms.forEach(p=>{
            p.update(dt);
            this.player.fixOverlap(p.rect);
        });
    };
    this.draw = function(gfx){
        game.clear();
        this.player.draw(gfx);
        this.platforms.forEach(p=>p.draw(gfx));
    };
}