import {Router} from "./router.js";

const state = {
    socket: {},
    connected: false,

}

export class WS {

    static connected() {
        return state.connected
    }

    static getWSUrl() {
        let url = '';
        if (window.location.protocol === 'https:') {
            url = 'wss://';
        } else {
            url = 'ws://';
        }
        url += window.location.hostname + ":8001" + '/websocket';
        return url;
    }


    static send(msg) {
        try {
            state.socket.send(msg);
        } catch (e) {
            this.SetupFromScratch();
            setTimeout(() => {
                WS.send(msg);
            }, 1000);
        }
    }

    static handler(x) {
        Router.handle(x)
    }

    static SetupFromScratch() {
        WS.Setup(WS.getWSUrl());
    }

    static Setup(url) {
        state.socket = new WebSocket(url);

        state.socket.onopen = function (e) {
            state.connected = true;
        };

        state.socket.onmessage = function (event) {
            WS.handler(event.data);
        };

        state.socket.onclose = function (event) {
            state.connected = false;
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.log('[close] Connection died');
            }
        };

        state.socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
        };
    }
}
