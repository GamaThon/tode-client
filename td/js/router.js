import {Messages} from "./msg.js";
import {WS} from './network.js';
import {ViewManager} from "./view.js";

const rState = {
    handlers: new Map()
}


export class Router {
    static setup() {
        //Setup handlers
        rState.handlers.set("S_CHANGE_VIEW", this.handleS_CHANGE_VIEW)

    }

    static handle(msg) {
        let o = JSON.parse(msg)
        let conversation = o.conversation;
        let f = rState.handlers.get(conversation)
        if (f) {
            f(o)
        } else {
            Messages.ErrorAlert("???", "Did not understand " + conversation)
            console.log(msg)
        }
    }

    static handleS_CHANGE_VIEW(x) {
        if (x.view === "NAMING") {
            console.log("asking for name")
            Messages.InputMessage("Name", (x) => {
                WS.send(JSON.stringify({
                    conversation: "P_NAME",
                    name: x
                }))
            })
        } else if (x.view === "MATCHING") {
            ViewManager.ChangeView("MATCHING")
        } else {
            console.log("Unknown view: " + x)
        }
    }

}