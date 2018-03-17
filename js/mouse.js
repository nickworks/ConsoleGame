const mouse = {
    x: 0,
    y: 0,
    setup: function(element){
        element.addEventListener("mousemove", (e)=>{
            this.x = e.offsetX;
            this.y = e.offsetY;
        });
    }
};