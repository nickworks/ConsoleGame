((a,c)=>{
    let loaded=0;
    a.forEach((u)=>{
        const s=document.createElement('script');
        s.addEventListener("load", ()=>{if(++loaded==a.length)c();});
        s.src=u; document.head.appendChild(s);
    });
})([
    'js/UI/Button.js',
    'js/UI/Menu.js',
    'js/UI/TextField.js',
    'js/UI/Dialog.js',
    'js/UI/Pause.js',
    'js/UI/TalkBubble.js',
    'js/UI/Keypad.js',
    'js/GameObjects/Camera.js',
    'js/GameObjects/NPC.js',
    'js/GameObjects/Platform.js',
    'js/GameObjects/Pawn.js',
    'js/GameObjects/Player.js',
    'js/GameObjects/Door.js',
    'js/GameObjects/Weapon.js',
    'js/GameObjects/Bullet.js',
    'js/GameObjects/Goal.js',
    'js/Core/Rect.js',
    'js/Core/Sprite.js',
    'js/Core/editor.js',
    'js/Core/keyboard.js',
    'js/Core/mouse.js',
    'js/Core/console.js',
    'js/Core/sprites.js',
    'js/Scenes/ScenePlay.js',
    'js/Scenes/SceneTitle.js',
    'js/Scenes/LevelData.js',
    'js/Core/game.js'
],()=>{
    game.start("myCanvas");
});