const keycode = {
    tab:9,
    enter:13,
    escape:27,
    space:32,
    left:37,
    up:38,
    right:39,
    down:40,
    n0:48,
    n1:49,
    n2:50,
    n3:51,
    n4:52,
    n5:53,
    n6:54,
    n7:55,
    n8:56,
    n9:57,
    p0:96,
    p1:97,
    p2:98,
    p3:99,
    p4:100,
    p5:101,
    p6:102,
    p7:103,
    p8:104,
    p9:105,
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