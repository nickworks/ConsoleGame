class Font {
    constructor(raw={}){
        this.size=raw.size||12;
        this.color=raw.color||"#000";
        this.font=raw.font||"Arial";
        this.align=raw.align||"left";
        this.baseline=raw.valign||"alphabetic";
    }
    apply(){
        gfx.fillStyle = this.color;
        gfx.font = this.size + "px " + this.font;
        gfx.textAlign = this.align;
        gfx.textBaseline = this.baseline;
    }
    measure(str){
        this.apply();
        return gfx.measureText(str);
    }
}