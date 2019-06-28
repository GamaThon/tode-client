import {Messages} from "./msg.js";

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
        let converesation = o.conversation;
        let f = rState.handlers.get(converesation)
        if (f) {
            f(msg)
        } else {
            Messages.ErrorAlert("???", "Did not understand " + converesation)
            console.log(msg)
        }
    }

    static handleS_CHANGE_VIEW(x) {
        if (x.view === "NAMING") {

        }
    }

}