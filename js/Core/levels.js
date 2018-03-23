function levelData(n){
    switch(n){
        case 0:
            return {
                player:new Player(0,0),
                platforms:[
                    new Platform(new Rect(0,200,100,100)),
                    new Platform(new Rect(100,150,100,100)),
                    new Platform(new Rect(200,200,100,100)),
                ],
                npcs:[
                    new NPC()
                ],
                doors:[
                    new Door(300,100)
                ]
            };
        case 2:
        default:
    }
    return {};
}