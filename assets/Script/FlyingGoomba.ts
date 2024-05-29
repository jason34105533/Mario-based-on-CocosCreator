// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FlyingGoomba extends cc.Component {

    @property({type:cc.Animation})
    anim: cc.Animation = null;

    @property({type:cc.AudioClip})
    clip: cc.AudioClip = null;

    direction: number = 1;

    cur_anim: string = "GoombaFly";
    isDead = false;
    init_pos: cc.Vec2 = cc.v2(0,0);

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.init_pos = this.node.getPosition();
        this.anim = this.getComponent(cc.Animation);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
    }

    update (dt) {
        // console.log(this.anim);
        this.playAnime(this.cur_anim);
        if(this.isDead) return;
        // I want it to fly an lower semicircle with orign at init_pos and radius 100
        let lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        let pos = this.node.getPosition();
        let x = pos.x - this.init_pos.x;
        let y = pos.y - this.init_pos.y;
        let r = 100;
        let angle = Math.atan2(y,x);
        let new_x = this.init_pos.x + r*Math.cos(angle + 0.01);
        let new_y = this.init_pos.y + r*Math.sin(angle + 0.01);
        this.node.setPosition(new_x,new_y);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        
    }

    playAnime(anim: string, clip?: cc.AudioClip) {
        // console.log("Play Anime");
        let _play = (anim: string) => {
            this.anim.play(anim)
        };
        if (!this.anim.getAnimationState(anim).isPlaying) {
            _play(anim);
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        
        // console.log(contact.getWorldManifold().normal.y);
        if (otherCollider.node.group == "player" && contact.getWorldManifold().normal.y == 1 ){

            let iframe = otherCollider.node.getComponent("Mario").iframe;

            if (otherCollider.node && iframe) {
                console.log("Mario iframe u can't kill me!");
                contact.disabled = true;
                return;
            }

            // console.log("Goomba hit player",contact.getWorldManifold().normal.y);
            // cc.audioEngine.playEffect(this.clip, false);

            this.cur_anim = "GoombaDead";
            this.isDead = true;
            contact.disabled = true;

            setTimeout(()=>{
                this.node.destroy();
            },400);
        }
    }
}
