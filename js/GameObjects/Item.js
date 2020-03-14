class Item {

    static Type = {
        HEAL: 1,
        AMMO: 2,
        COIN: 3,
        GUN: 4,
    }


    static random(raw){
    
        const r=Math.random();
        if(r<.1)raw.t=4; //10% chance of gun
        else if(r<.35)raw.t=1; //25% chance of health
        else if(r<.60)raw.t=2; //25% chance of ammo
        else raw.t=3; //40% chance of coin
        
        const i=new Item(raw);
        i.phys.vx=Math.random()*400-200;
        i.phys.vy=-(Math.random()*200+200);
        
        return i
    };


    constructor(raw={}){       
        
        this.oid=raw.i||0;
        this.type=raw.t||3;
        this.rect=Rect.from(raw);

        
        this.phys=new PhysicsComponent(this);
        this.phys.isAsleep=(!!raw.a);
        
        this.weapon=null;
        this.hint=null;
        this.showHint=false;


    }
    serialize(){
        const data={
            i:this.oid,
            x:this.rect.x|0,
            y:this.rect.y|0,
            t:this.type|0,
        };
        if(this.isAsleep)data.a=1;
        return data;
    }
    id(i){
        if(i)this.oid=i;
        return this.oid;  
    }
    update(){
        this.phys.update();
        this.rect.speed();
    }
    // checks if this object overlaps one or more other objects
    overlap(a){
        if(!Array.isArray(a))a=[a];
        a.forEach(o=>{
            if(!o.rect||!o.rect.overlaps(this.rect))return;//return if not overlapping
            this.pickup(o);
        });
    }
    pickup(o){

        switch(this.type){
            case Item.Type.HEAL:o.heal(25);break;
            case Item.Type.AMMO:
                const w = o.weapon();
                if(w)w.addAmmo(25);
                break;
            case Item.Type.COIN:PlayerController.data.coins++;break; //PlayerController.data.coins=(PlayerController.data.coins|0)+1;break;
            case Item.Type.GUN:
                if(o != scene.player.pawn) break;
                if(!this.weapon){
                    this.weapon=Weapon.random();
                    this.hint=new BubbleHint(this.weapon.title);
                }
                this.showHint=true;
                if(keyboard.onDown(key.activate())){
                    scene.player.weapon(this.weapon);
                    this.dead=true;
                }
                return;
        }
        this.dead=true;
    }
    draw(){
        
        var img;
        if(this.type==Item.Type.HEAL)img=sprites.item1;
        if(this.type==Item.Type.AMMO)img=sprites.item2;
        if(this.type==Item.Type.COIN)img=sprites.item3;
        if(this.type==Item.Type.GUN )img=sprites.gun;
        
        if(img)gfx.drawImage(img, this.rect.x, this.rect.y);
        else this.rect.draw();
        
        if(this.hint&&this.showHint){
            this.hint.x=this.rect.mid().x;
            this.hint.y=this.rect.y;
            this.hint.draw();
            this.showHint=false;
        }
    }
    applyFix(fix){
        this.rect.x+=fix.x;
        this.rect.y+=fix.y;
        this.phys.applyFix(fix);
        this.rect.cache();
    }
    changeType(){
        this.type++;
        if(this.type>3)this.type=1;
    }
}
