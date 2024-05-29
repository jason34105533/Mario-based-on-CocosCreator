// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import StageSelect from "./StageSelect";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadGame extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    delay = 2;

    @property(cc.Label)
    N: cc.Label = null;

    onLoad () {
        this.N.string = StageSelect.Choice.toString();
    }

    start () {
        // use StageSelect.Choice to determine reload which stage
        if (StageSelect.Choice == 1) {
            // cc.director.preloadScene("Stage1", () => {
            //     cc.director.loadScene("Stage1");
            // });
            this.scheduleOnce(() => { 
                cc.director .loadScene("Stage1") ;
            }, this.delay);
        } else if (StageSelect.Choice == 2) {
            // cc.director.preloadScene("Stage2", () => {
            //     cc.director.loadScene("Stage2");
            // });
            this.scheduleOnce(() => { 
                cc.director .loadScene("Stage2") ;
            }, this.delay);
        }
        console.log("Load Game");
        console.log(StageSelect.Choice);
    }

    // update (dt) {}
}
