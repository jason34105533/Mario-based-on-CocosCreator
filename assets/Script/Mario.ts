// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Camera from "./Camera";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Mario extends cc.Component {

    aDown = false;
    dDown = false;
    wDown = false;
    sDown = false;
    playerSpeed = 0;
    onGround = false;
    isDead = false;
    isWin = false;
    animeName:string = "MarioIdle";
    isPowerUp = false;
    audioID = -1;
    iframe = false;
    init_pos: cc.Vec2 = null;
    win_pos: cc.Vec2 = null;
    score_cnt:number = 0;


    @property({type:cc.AudioClip})
    JumpAudio: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    KickAudio: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    LoseALife: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    PowerUpAudio: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    PowerDownAudio: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    WinAudio: cc.AudioClip = null;

    @property({type:cc.Animation})
    anim: cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.anim = this.getComponent(cc.Animation);
        if (!this.init_pos) {
            this.init_pos = this.node.getPosition();
        }
    }

    onKeyDown(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
                this.aDown = true;
                break;
            case cc.macro.KEY.d:
                this.dDown = true;
                break;
            case cc.macro.KEY.w:
                this.wDown = true;
                break;
            case cc.macro.KEY.s:
                this.sDown = true;
                break;
        }
    }
    
    onKeyUp(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
                this.aDown = false;
                break;
            case cc.macro.KEY.d:
                this.dDown = false;
                break;
            case cc.macro.KEY.w:
                this.wDown = false;
                break;
            case cc.macro.KEY.s:
                this.sDown = false;
                break;
        }
    }

    private playermovent(dt){
        
        this.playerSpeed = 0;
        var lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        if(this.isWin){
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO;
            this.node.setPosition(this.win_pos);
            return;
        }
        else if(this.isDead){
            if(Camera.Life == 0) return;
            this.PlayerDead(() => {
                this.scheduleOnce(() => {
                    this.node.getComponent(cc.PhysicsCollider).enabled = true;
                    this.isDead = false;
                    this.isPowerUp = false;
                    this.node.setPosition(this.init_pos);
                    this.playAnime('MarioIdle');
                    console.log("Respawn");
                    this.iframe = true;
                    this.playBlink();
                    setTimeout(()=>{
                        this.iframe = false;
                    },1000);
                });
            });
            return;
        }
        else if(this.aDown){
            this.playerSpeed = lv.x = -150;
            this.node.scaleX = -1;
        }
        else if(this.dDown){
            this.playerSpeed = lv.x = 150;
            this.node.scaleX = 1;
        }
        else {
            this.playerSpeed = lv.x = 0;
        }
        
        if(this.wDown && this.onGround){
            this.jump();
        }

        this.node.getComponent(cc.RigidBody).linearVelocity = lv;
    }

    private jump(){
        this.onGround = false;
        // add an up force directly to the mass of the rigidbody (applyForceToCenter)
        this.node.getComponent(cc.RigidBody).linearVelocity.y = 400;
        // this.node.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(0,14000), true);
        cc.audioEngine.playEffect(this.JumpAudio, false);
    }  
    
    PlayerDead(animeFinishedCallback?: () => void){
        // this.isDead = false;
        // this.isPowerUp = false;

        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 400);
        this.getComponent(cc.PhysicsCollider).enabled = false;
        this.playAnime('MarioDead');
        setTimeout(() => {
            if (animeFinishedCallback) {
                animeFinishedCallback();
            }
        },2000);
    }


    onBeginContact(contact, selfCollider, otherCollider){
        // console.log("Contact block",otherCollider.node.name," ",contact.getWorldManifold().normal.y);
        
        if(otherCollider.node.group == "ground"  && contact.getWorldManifold().normal.y != 1){
            // console.log("Touch Down XDD");
            this.onGround = true;
        }
        else if(otherCollider.node.group == "block" && contact.getWorldManifold().normal.y != 1 && Math.abs(contact.getWorldManifold().normal.x)!=1){
            // when mario touch "UpperBlock" from buttom not to set onGround to true
            this.onGround = true;
        }
        else if(otherCollider.node.group == "enemy"){

            if(this.iframe == true) {
                contact.disabled = true;
                return;
            }
            else if(contact.getWorldManifold().normal.y != -1) {
                
                if(this.isPowerUp){
                    this.isPowerUp = false;
                    cc.audioEngine.playEffect(this.PowerDownAudio, false);
                    // this.playEffect(this.PowerDownAudio);
                    console.log("Power Down");
                    this.iframe = true;
                    this.scheduleOnce(() => {this.playBlink();});
                    setTimeout(()=>{
                        this.iframe = false;
                    },1000);
                    return;
                }
                else {
                    this.Dying();
                    return;
                }
            }
            else{
                if(otherCollider.node.name == "Flower") return;

                this.score_cnt+=300;
                contact.disabled = true;
                console.log("iframe : ",this.iframe);
                // set mario's y-velocity to 400
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 300);
                // this.jump();

                this.playEffect(this.KickAudio);
                console.log("Kill fucking enemy");

                // Destroy the fucking enemy
                otherCollider.node.group = "default";
                otherCollider.node.getComponent(cc.PhysicsCollider).destroy();
                otherCollider.node.getComponent(cc.RigidBody).destroy();
            }
        }
        else if(otherCollider.node.group == "boundary"){
            this.Dying();
            return;
        }
        else if(otherCollider.node.group == "flag"){
            this.win();
        }
        else if(otherCollider.node.group == "mushroom"){

            this.score_cnt += 200;

            contact.disable = true;
            otherCollider.node.destroy();

            if(this.isPowerUp) return;
            this.isPowerUp = true;
            this.scheduleOnce(() => {this.playBlink();});
            this.playEffect(this.PowerUpAudio);
        }
        else if(otherCollider.node.group == "coin"){
            contact.disable = true;
            this.score_cnt += 100;
        }
    }

    Dying() {
        Camera.Life-=1;
        Camera.Timer = Camera.FULL_TIME;
        this.score_cnt = Math.max(0,this.score_cnt-300);
        
        this.isDead = true;
        this.isPowerUp = false;

        cc.audioEngine.playEffect(this.LoseALife, false);
    }

    onEndContact(contact, selfCollider, otherCollider) {

        // console.log("End Collision");
        if(otherCollider.node.group == "ground" || otherCollider.node.group == "block") this.onGround = false;

    }

    UpdateAnimation(){
        // console.log("Update Animation");
        if (this.isDead) {
            this.playAnime('MarioDead');
        }
        else if(this.playerSpeed == 0 && this.onGround){
            this.playAnime('MarioIdle');
        }
        else if(!this.onGround){
            this.playAnime('MarioJump');
        }
        else if(this.playerSpeed != 0 && this.onGround){
            this.playAnime('MarioRun');
        }
    }

    playBlink() {
        let action = cc.spawn(
            cc.blink(1, 8),
            cc.flipX(true)
        );
        this.node.runAction(action);
    }

    onPreSolve(contact,selfCollider,otherCollider){

        if(otherCollider.node.group == "ground" || otherCollider.node.group == "block"){
            if(contact.getWorldManifold().normal.y == -1){
                this.onGround = true;
            }
        }
        else if(otherCollider.node.group == "enemy"){
            contact.disabled = true;
        }
    }

    win() {
        this.isWin = true;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.win_pos = this.node.getPosition();
        
        cc.audioEngine.stopAll();
        cc.audioEngine.playEffect(this.WinAudio, false);        
    }



    playAnime(anim: string, clip?: cc.AudioClip) {
        anim = this.isPowerUp ? "Big" + anim : anim;
        // console.log("Play Anime");
        let _play = (anim: string) => {
            this.animeName = anim;
            this.anim.play(this.animeName)
        };
        if (!this.anim.getAnimationState(anim).isPlaying) {
            _play(anim);
            if (clip) {
                this.playEffect(clip);
            }
        }
    }

    playEffect(clip: cc.AudioClip) {
        if (cc.audioEngine.getState(this.audioID) !== cc.audioEngine.AudioState.PLAYING) {
            this.audioID = cc.audioEngine.playEffect(clip, false);
        }
    }


    start () {

    }

    update (dt:number = 1/60) {
        if(Camera.Life == 0) return;

        let isDying = this.anim.getAnimationState('MarioDead').isPlaying;
        // console.log("Is Dying : ",isDying);
        if(isDying) return;

        this.playermovent(dt);
        this.UpdateAnimation();
    }
}
