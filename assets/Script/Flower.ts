// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    init_pos: cc.Vec2 = cc.v2(0, 0);
    move_dir = 1;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init_pos = this.node.getPosition();
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 50);
    }

    start () {
        console.log("Flower's position: ",this.node.position);
    }

    update (dt) {
        if(this.node.position.y >= this.init_pos.y + 60 && this.move_dir == 1){
            this.move_dir = -1;
        }
        else if(this.node.position.y <= this.init_pos.y && this.move_dir == -1){
            this.move_dir = 1;
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,this.move_dir * 50);
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        contact.disabled = true;
    }
}
