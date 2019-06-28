import {Messages} from "./msg.js";
import {WS} from './network.js';
import {ViewManager} from "./view.js";
import {Setup} from "./babylon-setup.js";

const rState = {
    handlers: new Map()
}


export class Router {
    static setup() {
        //Setup handlers
        rState.handlers.set("S_CHANGE_VIEW", this.handleS_CHANGE_VIEW)
        rState.handlers.set("S_GAMES", this.handleS_GAMES)

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
            // ViewManager.ChangeView("MATCHING")
            ViewManager.ChangeView("renderCanvas")
            Setup.start()
        } else {
            console.log("Unknown view: " + x)
        }
    }

    static handleS_GAMES(x) {

        document.getElementById("newGameId").onlick = function x() {
            Setup.start()
        }

        let t = document.getElementById("table")
        for (const i of x.games) {
            t.innerHTML += `<tr><td>1</td><td>2</td></tr>`
        }


    }

}