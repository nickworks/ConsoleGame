class Goal {
    constructor(raw={}){
        this.rect=new Rect(raw.x||0,raw.y||0,50,100);
        this.next=raw.n||0;
    }
    update(dt){
        return this.rect.overlaps(scene.player.pawn.rect);
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
    nextLevel(){
        return this.next;  
    }
}