function loadjs(a,c){
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
    'js/UI/Dialog.js',
    'js/UI/Pause.js',
    'js/UI/BubbleHint.js',
    'js/UI/BubbleBG.js',
    'js/UI/Keypad.js',
    'js/UI/HUD.js',
    'js/UI/Death.js',
    'js/GameObjects/Camera.js',
    'js/GameObjects/Item.js',
    'js/GameObjects/NPC.js',
    'js/GameObjects/Platform.js',
    'js/GameObjects/Pawn.js',
    'js/GameObjects/Player.js',
    'js/GameObjects/Door.js',
    'js/GameObjects/Weapon.js',
    'js/GameObjects/Bullet.js',
    'js/GameObjects/Goal.js',
    'js/Core/Quest.js',
    'js/Core/Callback.js',
    'js/Core/Rect.js',
    'js/Core/Sprite.js',
    'js/Core/Editor.js',
    'js/Core/keyboard.js',
    'js/Core/mouse.js',
    'js/Core/console.js',
    'js/Core/sprites.js',
    'js/Scenes/SceneLoad.js',
    'js/Scenes/ScenePlay.js',
    'js/Scenes/SceneTitle.js',
    'js/Core/Game.js'
],()=>loadjs(['js/Scenes/LevelData.js',],()=>game.start("myCanvas")));