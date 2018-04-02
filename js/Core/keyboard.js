const key = {
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
    f:70,
    n:78,
    p:80,
    q:81,
    r:82,
    s:83,
    t:84,
    w:87,
    x:88,
    z:90,
    tilde:192,
    ////////////////////////// INPUT MAPPING:
    jump:function(){return this.space},
    reload:function(){return [this.r]},
    menuChoose:function(){return [this.enter,this.space]},
    activate:function(){return [this.e,this.enter]},
    moveLeft:function(){return [this.left]},
    moveRight:function(){return [this.right]},
    exit:function(){return this.escape},
    console:function(){return this.tab},
    attack:function(){return this.f},
    sprint:function(){return this.shift},
    any:function(){return [this.space,this.e,this.f,this.tab,this.escape,this.r,this.left,this.right,this.enter]},
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
        
        if(gameInFocus){
            this.keys[e.keyCode] = value;
            switch(e.keyCode){
                case key.space:
                case key.left:
                case key.right:
                case key.down:
                case key.up:
                    e.preventDefault(); // prevent page-scrolling
            }
        } else {
            if(value&&(e.keyCode==key.tab||e.keyCode==key.escape)){
                //if(scene.unpause)scene.unpause();
                consoleObj.input.blur();
                e.preventDefault();
            }
        }
    },
    setup: function(){
        document.addEventListener("keydown", (e)=>this.updateKey(e, true));
        document.addEventListener("keyup", (e)=>this.updateKey(e, false));
    },
    blur:function(){
        for(var i in this.keys){
            this.keys[i]=false;
        }
    },
};