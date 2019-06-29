import {Messages} from "./msg.js";
import {WS} from './network.js';
import {ViewManager} from "./view.js";
import {Setup} from "./babylon-setup.js";
import {Baby} from "./baby.js";

const rState = {
    handlers: new Map()
}

export class Router {
    static setup() {
        //Setup handlers
        rState.handlers.set("S_CHANGE_VIEW", this.handleS_CHANGE_VIEW)
        rState.handlers.set("S_GAMES", this.handleS_GAMES)
        rState.handlers.set("S_PLAYER_NUMBER", this.handleS_PLAYER_NUMBER)
        rState.handlers.set("S_PLAYER_CREEP", this.handleS_PLAYER_CREEP)
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

    static handleS_PLAYER_NUMBER(x) {
        console.log(x)
        setTimeout(() => {
            if (x.playerNumber === 0) {
                Baby.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI, 2 * Math.PI / 6, 250, new BABYLON.Vector3(160, -40, 160), Baby.scene);
            } else if (x.playerNumber === 1) {
                Baby.camera = new BABYLON.ArcRotateCamera("Camera", 0, 2 * Math.PI / 6, 250, new BABYLON.Vector3(150, -40, 150), Baby.scene);
            }
            Baby.camera.attachControl(Baby.canvas, true);

            Baby.engine.runRenderLoop(function () {
                if (Baby.scene) {
                    Baby.scene.render();
                }
            });

            // Resize
            window.addEventListener("resize", function () {
                Baby.engine.resize();
            });


        }, 1000)
    }

    static handleS_PLAYER_CREEP(x) {
        console.log(x)
    }

}