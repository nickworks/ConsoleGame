((a)=>{
    a.forEach((u)=>{
        const s=document.createElement('script');
        s.src=u; document.head.appendChild(s);
    });
})([
    'js/Button.js',
    'js/Camera.js',
    'js/Menu.js',
    'js/NPC.js',
    'js/Platform.js',
    'js/Player.js',
    'js/Rect.js',
    'js/ScenePlay.js',
    'js/SceneTitle.js',
    'js/Sprite.js',
    'js/TextField.js',
    'js/keyboard.js',
    'js/mouse.js',
    'js/console.js',
    'js/game.js'
]);