class TextField {
	constructor(text="placeholder",x=0,y=0,font){
		this.text=text;
	    this.x=x;
	    this.y=y;
	    this.font=new Font(font);
	}
	draw(gfx){
        this.font.apply(gfx);
        gfx.fillText(this.text,this.x,this.y);
    }
}