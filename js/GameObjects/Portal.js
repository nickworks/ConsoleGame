class Portal {
    constructor(raw={}){
        this.rect=new Rect(raw.x||0,raw.y||0,50,100);
        this.next=raw.n||0;
        this.active=false;
        this.spawnpos=raw.p;
    }
    update(){
        this.active = this.rect.overlaps(scene.player.pawn.rect);
        if(this.active && keyboard.isDown(key.activate())) this.use();
    }
    serialize(){
        return {
            x:this.rect.x,
            y:this.rect.y,
            n:this.next
        };
    }
    draw(gfx){
        gfx.fillStyle="#39F";
        this.rect.draw(gfx);
    }
    use(){
        game.switchScene( SceneLoad.Level(this.next, this.spawnpos) );
    }
}