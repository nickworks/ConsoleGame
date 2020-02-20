const loadjs = (a,c)=>{
    let loaded=0;
    a.forEach((u)=>{
        const s=document.createElement('script');
        s.addEventListener("load", ()=>{if(++loaded==a.length)c();});
        s.src=u; document.head.appendChild(s);
    });
}
loadjs([
    
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

    'js/Controllers/Controller.js',
    'js/Controllers/AIController.js',
    'js/Controllers/PlayerController.js',

    'js/GameObjects/Particle.js',
    'js/GameObjects/Camera.js',
    'js/GameObjects/Item.js',
    'js/GameObjects/Platform.js',
    'js/GameObjects/Pawn.js',
    'js/GameObjects/Door.js',
    'js/GameObjects/Weapon.js',
    'js/GameObjects/Bullet.js',
    'js/GameObjects/Portal.js',
    'js/GameObjects/Crate.js',

    'js/Core/Quest.js',
    'js/Core/Callback.js',
    'js/Core/Rect.js',
    'js/Core/Sprite.js',
    'js/Core/Editor.js',
    'js/Core/Matrix.js',
    'js/Core/console.js',
    'js/Core/Input/mouse.js',
    'js/Core/Input/keyboard.js',

    'js/Scenes/Scene.js',
    'js/Scenes/SceneLoad.js',
    'js/Scenes/ScenePlay.js',
    'js/Scenes/SceneTitle.js',

    'js/Core/Game.js',

    'js/data/sprites.js',

],()=>loadjs(['js/data/LevelData.js',],()=>{

    
    window.scene=null;
    window.player=null;
    window.obj=()=>{};
    window.game=new Game();
    window.game.start("myCanvas");

}));