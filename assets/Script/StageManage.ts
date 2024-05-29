// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Mario from './Mario'
import StageSelect from './StageSelect';
declare const firebase: any;

@ccclass
export default class StageManage extends cc.Component {

    @property(cc.AudioClip)
    BGM: cc.AudioClip = null;

    @property(cc.Node)
    Player: cc.Node = null;

    @property(cc.Node)
    Camera: cc.Node = null;

    @property(cc.Node)
    Coins: cc.Node = null;

    @property(cc.Node)
    Flag: cc.Node = null;

    email: string = "";
    user: string = "";
    score: number = 0;
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // play background music
        cc.audioEngine.playMusic(this.BGM, true);
        
        this.InitUserInfo();

        this.Flag.getComponent(cc.RigidBody).onBeginContact = (contact,selfCollider,otherCollider) =>  {
            if (otherCollider.node.group === "player") {
                this.win();
            }
        }
    }

    async win() {
        if(StageSelect.Choice == 1) await this.UpdateFirebase();
        this.scheduleOnce (async () => {
            await cc.director.loadScene("StageSelect");
        },4.5);
    }

    InitUserInfo(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("UserInfo: ",user);
                this.email = user.email.split(".").join("_").replace(/@/g, "_");
    
                firebase.database().ref('users/' + this.email).once('value').then(snapshot => {
                    this.user = snapshot.val().name;
                    console.log("this.user:",this.user);
                });
            }
            else { // No user is signed in.
                cc.director.loadScene("Menu");
            }
        });
    }

    async UpdateFirebase() { // when win

        await firebase.database().ref('rank/' + this.user).once('value').then(snapshot => {
            // console.log("rank's snapshot.val():",snapshot.val());
            if(this.score > snapshot.val().score) {
                console.log("Update rank score");
                firebase.database().ref('rank/' + this.user).update({
                    score: this.score
                })
            }
        });

        await firebase.database().ref('users/' + this.email).once('value').then(snapshot => {
            // console.log("users' snapshot.val():",snapshot.val());
            if(this.score > snapshot.val().score) {
                console.log("Update users score")
                firebase.database().ref('users/' + this.email).update({
                    score: this.score
                })
            }
        });
        return;
    }

    update (dt) {
        if(this.Player){
            this.score = this.Player.getComponent(Mario).score_cnt;
        }
    }

    
}
