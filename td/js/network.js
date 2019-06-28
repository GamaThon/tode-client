export class WS {

    static socket = {};
    static connected = false;

    static getWSUrl() {
        let url = '';
        if (window.location.protocol === 'https:') {
            url = 'wss://';
        } else {
            url = 'ws://';
        }
        url += window.location.host + '/websocket';
        return url;
    }


    static send(msg) {
        try {
            WS.socket.send(msg);
        } catch (e) {
            this.SetupFromScratch();
            setTimeout(() => {
                WS.send(msg);
            }, 1000);
        }
    }

    static handler(x) {
        Router.Handlers.get(x.conversation)(x)
    }

    static SetupFromScratch() {
        WS.Setup(WS.getWSUrl());
    }

    static Setup(url) {
        let timerInterval
        Swal.fire({
            title: 'Opening connection',
            html: 'I will close in <strong></strong> seconds.',
            timer: 1000,
            onBeforeOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    Swal.getContent().querySelector('strong')
                        .textContent = Swal.getTimerLeft()
                }, 100)
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
        })


        console.log(url)
        WS.socket = new WebSocket(url);

        WS.socket.onopen = function (e) {
            WS.connected = true;
        };

        WS.socket.onmessage = function (event) {
            WS.handler(event.data);
        };

        WS.socket.onclose = function (event) {
            WS.connected = false;
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.log('[close] Connection died');
            }
        };

        WS.socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
        };
    }
}
