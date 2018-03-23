const keycode = {
    enter:13,
    escape:27,
    space:32,
    left:37,
    up:38,
    right:39,
    down:40,
    a:65,
    d:68,
    e:69,
    p:80,
    q:81,
    r:82,
    s:83,
    w:87,
};

const keyboard = {
    debug:false,
    keys:[],
    prev:[],
    isDown:function(keyCode){
        if(Array.isArray(keyCode)){
            let val = false;
            keyCode.forEach((c)=>{
                if(this.keys[c]) val = true;
            })
            return val;
        }
        return this.keys[keyCode] || false; // if the value is undefined, it will return false instead...
    },
    onDown:function(keyCode){
        if(Array.isArray(keyCode)){
            let val = false;
            keyCode.forEach((c)=>{
                if(this.onDown(c)) val = true;
            });
            return val;
        }
        return (this.isDown(keyCode) && (this.prev[keyCode] || false) == false);
    },
    update:function(){
        this.prev = this.keys.slice(0); // copy the array
    },
    updateKey: function(keyCode, value){
        if(this.debug)console.log(keyCode+(value?" down":" up"));
        
        if(document.activeElement == document.body)
            this.keys[keyCode] = value;
    },
    setup: function(){
        document.addEventListener("keydown", (e)=>this.updateKey(e.keyCode, true));
        document.addEventListener("keyup", (e)=>this.updateKey(e.keyCode, false));
    }
};