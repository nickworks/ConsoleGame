function ScenePlay(){
    this.cam=new Camera();
    this.player=new Player();
    this.platforms=[
        new Platform(new Rect(5,250,200,30)),
        new Platform(new Rect(210,200,200,30)),
        new Platform(new Rect(-205,200,200,60)),
        new Platform(new Rect(230,100,200,30)),
    ];
    this.npcs=[
        new NPC()
    ];
    this.modal=null;
    this.update = function(dt){
        this.player.update(dt);
        this.platforms.forEach(p=>{
            p.update(dt);
            this.player.fixOverlap(p.rect);
        });
        this.npcs.forEach(n=>{
            const overlaps=n.rect.overlaps(this.player.rect);
            n.update(dt, overlaps);
        });
        this.cam.update(dt, this.player);
    };
    this.draw = function(gfx){
        game.clear();
        this.cam.drawStart(gfx);
        this.player.draw(gfx);
        this.npcs.forEach(n=>n.draw(gfx));
        this.platforms.forEach(p=>p.draw(gfx));
        this.cam.drawEnd(gfx);
    };
}