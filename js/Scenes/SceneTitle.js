class SceneTitle {
    constructor(){
        this.title=new TextField("open source", 20, 50, {size:30,color:"#9AF"});
        this.menu = new Menu(0,100,game.width(),32,[
            {caption:"Play",callback:()=>{game.switchScene(SceneLoad.Level(0, {x:-1250, y:230}));}},
            {caption:"Tutorial",callback:()=>{game.console.log("// Tutorial coming soon!")}},
            {caption:"About",callback:()=>{

                const data = [
                    "Open Source v0.5",
                    "A game by Nick Pattison",
                    "",
                    "Write code to change the game!",
                    "Contribute to it here: <a href='https://github.com/nickworks/ConsoleGame' target='_blank'>https://github.com/nickworks/ConsoleGame</a>",
                    "",
                    "Featuring art by:",
                    "   Nick Pattison",
                    "   Jaylen Jennings",
                    "   Collin Pattison",
                    "",
                    "Featuring audio by:",
                    "   <a href='https://opengameart.org/content/q009s-weapon-sounds' target='_blank'>Q009</a>",
                ];
                var output="";
                const pre="\n *  ";
                data.forEach(s=>output+=pre+s);
                game.console.log("/*"+output+"\n *\n */");
            }}
        ]);
        PlayerController.data.reset();
    }
    update(){
        this.menu.update();
    }
    draw(){
        game.view.fill("#555");
        this.title.draw();
        this.menu.draw();
    }    
    
}