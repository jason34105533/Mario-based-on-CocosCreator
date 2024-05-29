// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class LogIn extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    closeLogIn() {
        cc.director.loadScene("Menu");
    }

    start () {

    }

    login() {
        var email = cc.find("Canvas/Forum/Email").getComponent(cc.EditBox).string;
        var password = cc.find("Canvas/Forum/Password").getComponent(cc.EditBox).string;

        if(email === "" || password === "") {
            alert("Please fill in all the fields.");
            return;
        }

        // use firebase to login
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
            alert("Successfully Logged In!");
            cc.director.loadScene("StageSelect");
        }).catch(error => {
            alert(error.message);
        });
    }

    // update (dt) {}
}
