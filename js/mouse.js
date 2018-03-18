const mouse = {
    x: 0,
    y: 0,
    down: false,
    prev: false,
    setup: function(element, game){
        element.addEventListener("mousemove", (e)=>{
            this.x = e.offsetX;
            this.y = e.offsetY;
        });
        element.addEventListener("mousedown", (e)=>{this.down=true;});
        document.addEventListener("mouseup", (e)=>{this.down=false;});
    },
    update: function(){
        this.prev = this.down;
    },
    isDown: function(){
        return this.down;
    },
    onDown: function(){
        return (this.down && !this.prev);
    }
};