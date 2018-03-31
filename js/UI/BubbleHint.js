function BubbleHint(text){
    this.x=0;
    this.y=0;
    this.font=new Font({valign:"top"});
    this.bg=new BubbleBG(0,0);
    var visible=false;
    
    this.update=function(){
        
    };    
    this.draw=function(gfx){
        
        gfx.beginTransform();
        gfx.translate(this.x,this.y);
        this.bg.draw(gfx);
        const p=this.bg.pos();
        this.font.apply(gfx);
        gfx.fillText(text, p.x, p.y);
        gfx.endTransform();
        
    };
    this.setText=function(t){
        text=t;
        const w=this.font.measure(game.gfx(),text).width;
        this.bg.setSize(w,14);
        this.bg.snap();
    };
    this.setText(text);
}