class BubbleHint {
    constructor(text) {
        this.x=0;
        this.y=0;
        this.font=new Font({valign:"top"});
        this.bg=new BubbleBG(0,0);
        //var visible=false;
        this.setText(text);
    }
    update(){
        
    }
    draw(gfx){
        
        Matrix.push();
        Matrix.translate(this.x,this.y);
        this.bg.draw(gfx);
        const p=this.bg.pos();
        this.font.apply(gfx);
        gfx.fillText(this.text, p.x, p.y);
        Matrix.pop();
        
    }
    setText(t){
        this.text=t;
        const w=this.font.measure(game.gfx(),this.text).width;
        this.bg.setSize(w,14);
        this.bg.snap();
    }
}