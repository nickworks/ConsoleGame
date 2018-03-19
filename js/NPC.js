function NPC(){
    this.rect=new Rect(230, 70, 25, 25);
    this.canTalk=false;
    this.update=function(dt, overlaps){
        this.canTalk=overlaps;
        if(overlaps && keyboard.onDown([keycode.e,keycode.enter])){
            // do dialog
            level.modal=new Dialog("Hello world, this is a dialog system!");
        }
    };
    this.draw=function(gfx){
        // TODO: use this.canTalk to show a "talk" icon
        const r=this.rect;
        gfx.fillRect(r.x,r.y,r.w,r.h);
    };
}