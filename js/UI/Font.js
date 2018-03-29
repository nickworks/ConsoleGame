function Font(raw={}){
    this.size=raw.size||12;
    this.color=raw.color||"#000";
    this.font=raw.font||"Arial";
    this.align=raw.align||"left";
    this.baseline=raw.valign||"alphabetic";
    this.apply=function(gfx){
        gfx.fillStyle = this.color;
        gfx.font = this.size + "px " + this.font;
        gfx.textAlign = this.align;
        gfx.textBaseline = this.baseline;
    };
    this.measure=function(gfx, str){
        this.apply(gfx);
        return gfx.measureText(str);
    };
}