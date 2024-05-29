// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Mario from "./Mario";

const {ccclass, property} = cc._decorator;

@ccclass
export default class QuestionBox extends cc.Component {

    @property({type:cc.Animation})
    anim: cc.Animation = null;

    @property({type:cc.AudioClip})
    clip: cc.AudioClip = null;

    rigid: cc.RigidBody = null;

    @property({type: cc.Prefab})
    MushroomPrefab: cc.Prefab = null;

    @property({type: cc.Prefab})
    CoinPrefab: cc.Prefab = null;

    @property({type:cc.AudioClip})
    MushroomAudio: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    CoinAudio: cc.AudioClip = null;
    
    type: string = "";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    playAnime(anim: string, clip?: cc.AudioClip) {
        // console.log("Play Anime");
        let _play = (anim: string) => {
            this.anim.play(anim)
        };
        if (!this.anim.getAnimationState(anim).isPlaying) {
            _play(anim);
        }
    }


    start () {
        this.rigid = this.getComponent(cc.RigidBody);
        this.anim = this.getComponent(cc.Animation);
        this.type = this.node.getParent().getParent().name;
    }

    update (dt) {
        this.playAnime("QuestionBox");
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log(contact.getWorldManifold().normal.y);
        if (otherCollider.node.group == "player" && contact.getWorldManifold().normal.y == -1) {
            // cc.audioEngine.playEffect(this.clip, false);
            this.node.destroy();
            if(this.type == "MushroomQuestionBoxs"){
                cc.audioEngine.playEffect(this.MushroomAudio, false);
                let prefab = cc.instantiate(this.MushroomPrefab);
                prefab.setPosition(cc.v2(0, 8));
                let mushroomRigid = prefab.getComponent(cc.RigidBody);
                mushroomRigid.linearVelocity = cc.v2(50, 0);

                mushroomRigid.onBeginContact = (contact, selfCollider, otherCollider) => {
                if (Math.abs(contact.getWorldManifold().normal.x) == 1) {
                        mushroomRigid.linearVelocity = cc.v2(
                            contact.getWorldManifold().normal.x < 0 ?
                                +50 : -50,
                            mushroomRigid.linearVelocity.y
                        );
                        contact.disabled = true;
                    }
                }
                
                this.node.parent.addChild(prefab);
            }
            else{
                // CoinQestionBox
                otherCollider.node.getComponent(Mario).score_cnt += 100;

                cc.audioEngine.playEffect(this.CoinAudio, false);
                let prefab = cc.instantiate(this.CoinPrefab);
                prefab.setPosition(cc.v2(0, 16));
                // chanhe prefab's rigidbody's type to "kinematic"
                prefab.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic;
                prefab.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 50);
                // chanhe prefab's scale to 0.8
                prefab.setScale(0.8);

                // change the prefab's group to "default"
                prefab.group = "default";
                this.node.parent.addChild(prefab);
                setTimeout(() => {
                    // destroy the coin after 1 second
                    prefab.destroy();
                }, 500);
            }
        }
    }
}
