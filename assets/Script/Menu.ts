// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class Menu extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                cc.audioEngine.stopMusic();
                cc.director.loadScene("StageSelect");
            }
        });
    }

    LogIn() {
        cc.audioEngine.stopMusic();
        cc.director.loadScene("LogIn");
    }

    SignUp() {
        cc.audioEngine.stopMusic();
        cc.director.loadScene("SignUp");
    }

    // update (dt) {}
}
