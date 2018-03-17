var consoleObj = {
    consoleDiv:undefined,
    output:undefined, // the <div> that contains several <p>
    inputP:undefined, // the <p> that contains <input>
    input:undefined, // the <input>
    setup:function(){
        this.consoleDiv = document.getElementById("console");
        this.input = document.getElementById("console-input");
        this.output = document.getElementById("console-output");
        this.inputP = document.getElementById("input-p");
        this.input.addEventListener("keydown", (e) => {
            if(e.keyCode == 13) this.handleInput();
        });
        
        document.getElementById("bttn-hide").addEventListener("click", () => this.hide());
        document.getElementById("bttn-show").addEventListener("click", () => this.show());
        document.getElementById("bttn-clear").addEventListener("click", () => this.clear());
    },
    handleInput:function(){
        var result = "";
        try{
            result = window.eval(this.input.value);
            if(typeof(result) == "string") result = '"'+result+'"';
            if(typeof(result) == "object") result = JSON.stringify(result, null, 4);
        } catch(e){
            result = e.message;
        }
        this.outputToConsole("js> " + this.input.value, true);
        this.outputToConsole(result);
        this.input.value = "";
        this.scrollToBottom();
    },
    outputToConsole:function(msg, isIn = false){
        var p = document.createElement("p");
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
    }
};
consoleObj.setup();