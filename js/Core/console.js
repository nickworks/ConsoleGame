const consoleObj = {
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
        //document.getElementById("bttn-hide").addEventListener("click", () => this.hide());
        //document.getElementById("bttn-show").addEventListener("click", () => this.show());
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
        this.log(result, "js> " + this.input.value);
        this.input.value = "";
    },
    log:function(msg, msgIn=""){
        
        const makeP=(txt,clss="")=>{
            var p=document.createElement("p");
            if(clss)p.classList.add(clss);
            p.appendChild(document.createTextNode(txt));
            return p;
        };
        this.output.prepend(makeP(msg));
        if(msgIn){
            this.output.prepend(makeP(msgIn,"in"));
        }
        this.scrollToTop();
    },
    scrollToTop:function(){
        this.output.scrollTop = 0;
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
            result+='    '+prop+': ';
            switch(typeof(obj[prop])){
                case "object":
                    if(Array.isArray(obj[prop]))
                        result+="[Array]";
                    else if(obj[prop]===null)
                        result+="null";
                    else
                        result+="["+obj[prop].constructor.name+" Object]";
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