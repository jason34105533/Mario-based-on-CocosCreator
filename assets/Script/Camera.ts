// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import Mario from './Mario'

@ccclass
export default class Camera extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    @property
    yAxisValid = false;

    @property(cc.Node)
    Player: cc.Node = null;

    @property(cc.Label)
    ScoreLabel: cc.Label = null;

    @property(cc.Label)
    LifeLabel: cc.Label = null;

    @property(cc.Label)
    TimerLabel: cc.Label = null;

    static Life: number = 5;
    static Score: number = 0;
    static Timer: number = 300;
    static FULL_TIME: number = 300;

    Counter: number = 0;
    isLoadingBack: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log(this.Player);
        // Initialize varaibles
        Camera.Life = 5;
        Camera.Timer = Camera.FULL_TIME;

        // Camera.Score DNE , Mario's score_cnt instead

        this.Counter = 0;
    }

    // start () {

    // }

    
    
    update (dt:number = 1/60) {

        if(this.isLoadingBack) return;

        if(Camera.Life == 0) {
            this.isLoadingBack = true;
            cc.audioEngine.stopMusic();
            this.scheduleOnce(() => {
                cc.director.loadScene("GameOver");
            });
        }

        if(this.Player.getComponent(Mario).isDead) return;      

        if(!this.Player.getComponent(Mario).isWin) this.Counter += 1;

        if(this.Counter % 60 == 0) {
            Camera.Timer -= 1;
            this.Counter = 0;
        }

        if(Camera.Timer == 0) this.Player.getComponent(Mario).Dying();


        this.ScoreLabel.string = this.Player.getComponent(Mario).score_cnt.toString();
        this.LifeLabel.string = Camera.Life.toString();
        this.TimerLabel.string = Camera.Timer.toString();

        // console.log(this.Player);
        if (this.Player) {
            let tar_pos = this.Player.getPosition();
            tar_pos.x = tar_pos.x > 0 ? tar_pos.x : 0;
            if (this.yAxisValid)
                tar_pos.y = tar_pos.y > 0 ? tar_pos.y : 0;
            let new_pos = this.node.getPosition();
            new_pos.lerp(tar_pos, 0.2, new_pos);
            this.node.x = new_pos.x;
            if (this.yAxisValid)
                this.node.y = new_pos.y;
        }
    }
}
