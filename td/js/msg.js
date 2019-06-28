export class Messages {

    static ErrorAlert(title, body) {
        Swal.fire({
            type: 'error',
            title: title,
            text: body
        })
    }


}