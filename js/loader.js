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
    'js/GameObjects/Camera.js',
    'js/GameObjects/NPC.js',
    'js/GameObjects/Platform.js',
    'js/GameObjects/Pawn.js',
    'js/GameObjects/Player.js',
    'js/GameObjects/Door.js',
    'js/GameObjects/Bullet.js',
    'js/GameObjects/Goal.js',
    'js/core/Rect.js',
    'js/core/Sprite.js',
    'js/core/editor.js',
    'js/core/keyboard.js',
    'js/core/mouse.js',
    'js/core/console.js',
    'js/core/sprites.js',
    'js/Scenes/ScenePlay.js',
    'js/Scenes/SceneTitle.js',
    'js/Scenes/Level1.js',
    'js/core/game.js'
],()=>{
    game.begin("myCanvas");
});