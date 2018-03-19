function NPC(){
    this.rect=new Rect(230, 70, 25, 25);
    
    this.update=function(dt, overlaps){
        if(overlaps && keyboard.onDown([keycode.e,keycode.enter])){
            // do dialog
            console.log("dialog");
        }
    };
    this.draw=function(gfx){
        const r=this.rect;
        gfx.fillRect(r.x,r.y,r.w,r.h);
    };
}