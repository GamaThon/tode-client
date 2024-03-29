export class Messages {

    static ErrorAlert(title, body) {
        Swal.fire({
            type: 'error',
            title: title,
            text: body
        })
    }

    static TimedMessage() {
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
    }

    static InputMessage(title, winHandler) {
        Swal.fire({
            title: title,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'OK',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.value) {
                winHandler(result.value)
            }
        })
    }


}