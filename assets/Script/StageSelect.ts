// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class StageSelect extends cc.Component {

    @property(cc.AudioClip)
    BGM: cc.AudioClip = null;

    @property(cc.Button)
    Stage_1: cc.Button = null;

    @property(cc.Button)
    Stage_2: cc.Button = null;

    @property(cc.Label)
    UserName: cc.Label = null;

    @property(cc.Label)
    ScoreNum: cc.Label = null;

    static Choice: number = 1;

    email: string = "";
    user: string = "";

    // LIFE-CYCLE CALLBACKS:

   async onLoad () {

        await this.InitUserInfo();

        this.Stage_1.node.on("click", () => {
            StageSelect.Choice = 1;
            cc.audioEngine.stopMusic();
            this.scheduleOnce(() => {
                cc.director.loadScene("LoadGame");
            },0.5);
        });

        this.Stage_2.node.on("click", () => {
            StageSelect.Choice = 2;
            cc.audioEngine.stopMusic();
            this.scheduleOnce(() => {
                cc.director.loadScene("LoadGame");
            },0.5);
        });
    }

    start () {
        // play background music
        cc.audioEngine.playMusic(this.BGM, true);
        
    }

    async InitUserInfo(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("UserInfo: ",user);
                this.email = user.email.split(".").join("_").replace(/@/g, "_");
    
                firebase.database().ref('users/' + this.email).once('value').then(snapshot => {
                    this.user = snapshot.val().name;
                    console.log("this.user:",this.user);
                    this.UserName.string = this.user.toUpperCase();
                    this.ScoreNum.string = snapshot.val().score;
                });
            }
            else { // No user is signed in.
                cc.director.loadScene("Menu");
            }
        });
    }

    async LogOut() {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            alert("Successfully Logged Out!");
        }).catch((error) => {
            // An error happened.
            alert(error.message);
        });
        cc.audioEngine.stopMusic();
        cc.director.loadScene("Menu");
    }

    // update (dt) {}
}
