// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    @property({type:cc.Animation})
    anim: cc.Animation = null;

    @property({type:cc.AudioClip})
    clip: cc.AudioClip = null;

    rigid: cc.RigidBody = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.rigid = this.getComponent(cc.RigidBody);
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt:number = 1/60) {
        // console.log(this.anim);
        this.playAnime("Coin");
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
        if (otherCollider.node.group == "player") {
            cc.audioEngine.playEffect(this.clip, false);
            this.node.destroy();
        }
    }
}
