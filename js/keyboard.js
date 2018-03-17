const keycode = {
    w: 87,
    a: 65,
    s: 83,
    d: 68,
    left: 37,
    up:38,
    right:39,
    down:40,
    space:32,
    enter:13,
    escape:27
};

const keyboard = {
    keys:[],
    prev:[],
    isDown:function(keyCode){
        return this.keys[keyCode] || false; // if the value is undefined, it will return false instead...
    },
    onDown:function(keyCode){
        return (this.isDown(keyCode) && (this.prev[keyCode] || false) == false);
    },
    update:function(){
        this.prev = this.keys.slice(0); // copy the array
    },
    updateKey: function(keyCode, value){
        //console.log(keyCode + (value ? " down" : " up"));
        this.keys[keyCode] = value;
    },
    setup: function(){
        document.addEventListener("keydown", (e)=>this.updateKey(e.keyCode, true));
        document.addEventListener("keyup", (e)=>this.updateKey(e.keyCode, false));
    }
};