// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    delay = 5;

    @property(cc.AudioClip)
    loseBGM: cc.AudioClip = null;

    // onLoad () {

    // }

    start () {
        cc.audioEngine.playMusic(this.loseBGM, false);

        this.scheduleOnce(() => { 
            cc.director.loadScene("StageSelect") ;
        }, this.delay);
        console.log("Game Over haha");
    }

    // update (dt) {}
}
