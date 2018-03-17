function TextField(text = "placeholder", x = 0, y = 0, size = 20){
    this.text = text;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = "#000";
    this.font = "Arial";
    this.align = "center";
    this.baseline = "Alphabetic";
    this.maxWidth = undefined;
    this.draw = function(gfx){
        gfx.fillStyle = this.color;
        gfx.font = this.size + "px " + this.font;
        gfx.textAlign = this.align;
        gfx.baseline = this.baseline;
        gfx.fillText(this.text, this.x, this.y, this.maxWidth);
    };
}