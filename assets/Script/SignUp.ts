// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class SignUp extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    closeSignUp() {
        cc.director.loadScene("Menu");
    }

    start () {

    }

    signup() {
        var username = cc.find("Canvas/Forum/Username").getComponent(cc.EditBox).string.toUpperCase();
        var email = cc.find("Canvas/Forum/Email").getComponent(cc.EditBox).string;
        var password = cc.find("Canvas/Forum/Password").getComponent(cc.EditBox).string;

        if(username === "" || email === "" || password === "") {
            alert("Please fill in all the fields.");
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
            firebase.database().ref('rank/' + username).set({
              score: 0
            })
            firebase.database().ref('users/' + email.split(".").join("_").replace(/@/g, "_")).set({
              name: username,
              email: email,
              password: password,
              score: 0,
            }).then(() => { 
              alert("Successfully Signed Up!");
              cc.director.loadScene("StageSelect");
            }).catch(error => { 
              alert(error.message); 
            });
          }).catch(error => { 
            alert(error.message); 
          });

        //cc.log(email.split(".").join("_").replace(/@/g, "_"));
    }

    // update (dt) {}
}
