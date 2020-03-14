class Console {
    constructor(){
        this.consoleDiv = undefined;
        this.output = undefined; // the <div> that contains several <p>
        this.inputP = undefined; // the <p> that contains <input>
        this.input = undefined; // the <input>
        this.settings = {showFunctions:false};
        this.history = {s:[],i:0,add:function(c){this.s.push(c);this.i=this.s.length;}};

        this.consoleDiv = document.getElementById("console");
        this.input = document.getElementById("console-input");
        this.output = document.getElementById("console-output");
        this.inputP = document.getElementById("input-p");
        this.input.addEventListener("keydown", (e) => {
            switch(e.keyCode){
                case key.tab: break; // prevent this from interfering with the page keyboard input
                case key.escape: break;
                case key.up: this.handleHistory(-1); break;
                case key.down: this.handleHistory(+1); break;
                case key.enter: this.handleInput(); break;
                default: return;
            }
            e.preventDefault();
        });
        
        const bttn=document.getElementById("bttn-clear");
        //bttn.addEventListener("focus",()=>bttn.blur());
        bttn.addEventListener("click",()=>this.clear());
    }
    isActive(){
        return document.body.className=="console";
    }
    focus(){
        document.body.className="console";
    }
    blur(){
        document.body.className="game";
        this.input.blur();
    }
    update(){
        // something other than the page is in focus, switch modes:
        if(document.activeElement!=document.body)this.focus();
        if(mouse.onDown()||mouse.onDownRight())this.blur();

        // hide scroll bar when the game is in focus
        document.scrollingElement.style.overflowY=(this.isActive())?"scroll":"hidden";

        if(!this.isActive()){
            document.scrollingElement.scrollTop-=(document.scrollingElement.scrollTop/3);
        }
    }
    handleHistory(offset){
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
    }
    handleInput(){
        var cmd = this.input.value.trim();
        if(cmd.length == 0) return;
        this.history.add(cmd);

        var result = "";
        try{
            result = window.eval(cmd);
            if(typeof(result) == "string") result = '"'+result+'"';
            if(typeof(result) == "function" && (this.settings.showFunctionBodies || Game.DEVMODE) == false) result = '[function]'; // comment this out to see function bodies
            if(typeof(result) == "object") result = this.stringify(result);
        } catch(e){
            result = e.message;
        }
        this.log(result, "> " + this.input.value);
        this.input.value = "";
    }
    log(msg, msgIn=""){
        
        const makeP=(txt,clss="")=>{
            var p=document.createElement("p");
            if(clss)p.classList.add(clss);
            p.innerHTML = txt;
            //p.appendChild(document.createTextNode(txt));
            return p;
        };
        this.output.prepend(makeP(msg));
        if(msgIn){
            this.output.prepend(makeP(msgIn,"in"));
        }
        this.scrollToTop();
    }
    
    // this function outputs large amounts of data into a <textarea>
    // this is useful for outputting serialized data
    logData(msg,pre=""){
        var i=document.createElement("textarea");
        i.setAttribute("readonly", "true");
        i.addEventListener("click", ()=>i.setSelectionRange(0,i.value.length));
        i.appendChild(document.createTextNode(msg));
        
        var d=document.createElement("div");
        d.appendChild(i);
        
        var p=document.createElement("p");
        p.appendChild(document.createTextNode(pre));
        p.appendChild(d);
        this.output.prepend(p);
    }
    scrollToTop(){
        this.output.scrollTop = 0;
    }
    scrollToBottom(){
        this.output.scrollTop = this.output.scrollHeight;
    }
    clear(){
        while(this.output.firstChild){
            if(this.output.firstChild === this.inputP) break;
            this.output.removeChild(this.output.firstChild);
        }
    }
    stringify(obj){
        const isArr = (Array.isArray(obj));
        var result=isArr?'[\n':'{\n';


        const showAll = (this.settings.showFunctions || Game.DEVMODE);

        if(showAll) result += "\n    // properties:\n\n";

        result += this.listProps(obj);

        if(showAll) {
            result += "\n    // functions:\n\n";
            result += this.listFunctions(obj);
        }
        
        
        result+=isArr?']':'}';    
        return result;
    }
    listProps(obj, listFunctions = false){
        var result = "";
        for(var prop in obj){
            
            if (!listFunctions && typeof obj[prop] == "function") continue;
            if (listFunctions && typeof obj[prop] != "function") continue;

            result += '    '+prop+' <dim>:</dim> ';
            switch(typeof(obj[prop])){
                case "object":
                    if(Array.isArray(obj[prop]))
                        result+="[array]";//" // "+obj[prop].length+" items";
                    else if(obj[prop]===null)
                        result+="null";
                    else
                        result+="<dim>["+obj[prop].constructor.name+" object]</dim>";
                    break;
                case "function":
                    result+="<dim>[function]</dim>";
                    break;
                case "string":
                    result+='"'+obj[prop]+'"';
                    break;
                default:
                    result+="<val>"+obj[prop]+"</val>";
                    break;
            }
            result+='<dim>,</dim>\n';
        }
        return result;
    }
    listFunctions(obj){
        var result="";
        const prototype = Object.getPrototypeOf(obj);
        const props = Object.getOwnPropertyNames(prototype);

        props.forEach(prop=>{
            if(typeof prototype[prop] != "function") return;
            result += '    '+prop+' <dim>: [function],</dim>\n';
        });
        result += this.listProps(obj, true);

        return result;
    }
}