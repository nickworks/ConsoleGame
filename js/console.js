var consoleObj = {
    consoleDiv:undefined,
    output:undefined, // the <div> that contains several <p>
    inputP:undefined, // the <p> that contains <input>
    input:undefined, // the <input>
    settings:{showFunctions:false},
    history:{s:[],i:0,add:function(c){this.s.push(c);this.i=this.s.length;}},
    setup:function(){
        this.consoleDiv = document.getElementById("console");
        this.input = document.getElementById("console-input");
        this.output = document.getElementById("console-output");
        this.inputP = document.getElementById("input-p");
        this.input.addEventListener("keydown", (e) => {
            switch(e.keyCode){
                case 13: this.handleInput(); break;
                case 38: this.handleHistory(-1); break;
                case 40: this.handleHistory(+1); break;
                default: return;
            }
            e.preventDefault();
        });
        document.getElementById("bttn-hide").addEventListener("click", () => this.hide());
        document.getElementById("bttn-show").addEventListener("click", () => this.show());
        document.getElementById("bttn-clear").addEventListener("click", () => this.clear());
    },
    handleHistory:function(offset){
        const h = this.history;
        h.i+=offset;
        if(h.i < 0) h.i = 0;
        if(h.i < h.s.length) {
            this.input.value = h.s[h.i];
        } else {
            h.i = h.s.length;
            this.input.value = '';
        }
        const p = this.input.value.length;
        this.input.setSelectionRange(p, p);
    },
    handleInput:function(){
        var cmd = this.input.value.trim();
        if(cmd.length == 0) return;
        this.history.add(cmd);
        var result = "";
        try{
            result = window.eval(cmd);
            if(typeof(result) == "string") result = '"'+result+'"';
            if(typeof(result) == "function" && (this.settings.showFunctionBodies || false) == false) result = '[function]'; // comment this out to see function bodies
            if(typeof(result) == "object") result = this.stringify(result);
        } catch(e){
            result = e.message;
        }
        this.outputToConsole("js> " + this.input.value, true);
        this.outputToConsole(result);
        this.input.value = "";
        this.scrollToBottom();
    },
    outputToConsole:function(msg, isIn = false){
        const p = document.createElement("p");
        if(isIn) p.classList.add("in");
        p.appendChild(document.createTextNode(msg));
        this.output.insertBefore(p,this.inputP);
    },
    scrollToBottom:function(){
        this.output.scrollTop = this.output.scrollHeight;
    },
    clear:function(){
        while(this.output.firstChild){
            if(this.output.firstChild === this.inputP) break;
            this.output.removeChild(this.output.firstChild);
        }
    },
    show:function(){
        this.consoleDiv.classList.add("viz");
    },
    hide:function(){
        this.consoleDiv.classList.remove("viz");
    },
    stringify:function(obj){
        const isArr = (Array.isArray(obj));
        var result=isArr?'[\n':'{\n';
        for(var prop in obj){
            if(typeof obj[prop] == "function" && !this.settings.showFunctions) continue;
            result+='    ';
            if(!isArr)result+=prop+': ';
            switch(typeof(obj[prop])){
                case "object":
                    result+="[Object]";
                    break;
                case "function":
                    result+="[function]";
                    break;
                case "string":
                    result+='"'+obj[prop]+'"';
                    break;
                default:
                    result+=obj[prop];
                    break;
            }
            result+=',\n';
        }
        result+=isArr?']':'}';    
        return result;
    }
};
consoleObj.setup();