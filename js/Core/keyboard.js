const keycode = {
    tab:9,
    enter:13,
    escape:27,
    space:32,
    left:37,
    up:38,
    right:39,
    down:40,
    "1":49,
    "2":50,
    "3":51,
    "4":52,
    a:65,
    d:68,
    e:69,
    n:78,
    p:80,
    q:81,
    r:82,
    s:83,
    w:87,
    tilde:192,
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
    updateKey: function(e, value){
        if(this.debug)console.log(e.keyCode+(value?" down":" up"));
        
        const gameInFocus=(document.activeElement==document.body);
        const toggleFocus=(value&&e.keyCode==keycode.tab);
        
        if(gameInFocus){
            this.keys[e.keyCode] = value;
            if(toggleFocus)consoleObj.input.focus();
            e.preventDefault();
        } else {
            if(toggleFocus){
                consoleObj.input.blur();
                e.preventDefault();
            }
        }
    },
    setup: function(){
        document.addEventListener("keydown", (e)=>this.updateKey(e, true));
        document.addEventListener("keyup", (e)=>this.updateKey(e, false));
    }
};