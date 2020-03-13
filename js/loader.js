const files=[
    
    'js/Core/Maths.js',
    'js/UI/Font.js',
    'js/UI/Button.js',
    'js/UI/Menu.js',
    'js/UI/TextField.js',
    'js/UI/BubbleHint.js',
    'js/UI/ShapeBubble.js',

    'js/UI/Modals/Modal.js',
    'js/UI/Modals/Keypad.js',
    'js/UI/Modals/Dialog.js',
    'js/UI/Modals/Pause.js',
    'js/UI/Modals/HUD.js',
    'js/UI/Modals/Death.js',
    'js/UI/Modals/Editor.js',

    'js/Components/PhysicsComponent.js',
    
    'js/GameObjects/Pawn/Controllers/Controller.js',
    'js/GameObjects/Pawn/Controllers/AIController.js',
    'js/GameObjects/Pawn/Controllers/PlayerController.js',
    'js/GameObjects/Pawn/Pawn.js',
    'js/GameObjects/Pawn/PawnStates.js',

    'js/GameObjects/Particle.js',
    'js/GameObjects/Item.js',
    'js/GameObjects/Platform.js',
    'js/GameObjects/Door.js',
    'js/GameObjects/Weapon.js',
    'js/GameObjects/Bullet.js',
    'js/GameObjects/Portal.js',
    'js/GameObjects/Crate.js',
    'js/GameObjects/ProximityMine.js',

    'js/Core/Camera.js',
    'js/Core/Quest.js',
    'js/Core/Callback.js',
    'js/Core/Rect.js',
    'js/Core/Sprite.js',
    'js/Core/Matrix.js',
    'js/Core/console.js',
    'js/Core/Input/mouse.js',
    'js/Core/Input/keyboard.js',

    'js/Scenes/Scene.js',
    'js/Scenes/SceneLoad.js',
    'js/Scenes/ScenePlay.js',
    'js/Scenes/SceneTitle.js',

    'js/Core/game.js',

    'js/data/sprites.js',
    'js/data/LevelData.js',
];

// This function loads one or more scripts in order,
// when they're all loaded, an optional callback is ran.
// It is a recursive nightmare.

const loadThen=(a,callback=()=>{})=>{
    let loaded=0;
    if(typeof a=="string"){
        // LOAD SCRIPT:
        const s=document.createElement('script');
        s.addEventListener("load", ()=>{ // when the file has loaded:
            console.log(a+" loaded!");
            if(typeof callback == "function")callback(); // run the callback
        });
        s.src=a; document.head.appendChild(s); // add the <script> to the DOM
    }
    else if(Array.isArray(a)){
        if(a.length > 0)
            loadThen(a[0],()=>{ // load the first script in the array
                a=a.slice(1); // then shift the array
                loadThen(a,callback); // do it again
            }); 
        else if(typeof callback=="function")callback(); // run the callback
    }
};

loadThen(files,()=>{
    console.log("------ ALL FILES LOADED ------");
    console.log("launching game...");
    
    window.scene=null;
    window.player=null;
    window.cam=null;
    window.obj=()=>{};
    window.game=new Game();
    window.game.start("myCanvas");

});