// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UpperBlock extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, selfCollider, otherCollider) {
        // console.log("UpperBlock contact.getWorldManifold().normal.y",contact.getWorldManifold().normal.y);
        if (contact.getWorldManifold().normal.y < 1) {
            contact.disabled = true;
        }
    }
}
