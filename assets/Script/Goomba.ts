// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {

    @property({type:cc.Animation})
    anim: cc.Animation = null;

    @property({type:cc.AudioClip})
    clip: cc.AudioClip = null;

    direction: number = 1;

    cur_anim: string = "GoombaRun";
    isDead = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-50,0);
    }

    update (dt) {
        // console.log(this.anim);
        this.playAnime(this.cur_anim);
        if(this.isDead) return;
        let lv = this.node.getComponent(cc.RigidBody).linearVelocity;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.direction*-50,lv.y);
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
        if (otherCollider.node.group == "block" && contact.getWorldManifold().normal.x!=0) {
            // console.log("Goomba hit block");
            this.direction = -this.direction;
        }
        else if (otherCollider.node.group == "player" && contact.getWorldManifold().normal.y == 1 ){

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
