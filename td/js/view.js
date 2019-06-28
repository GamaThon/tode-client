export class ViewManager {
    static ChangeView(id) {
        ViewManager.change("renderCanvas", false)
        ViewManager.change("MATCHING", false)

        ViewManager.change(id, true)

    }

    static change(i, v) {
        if (v) {
            document.getElementById(i).style.display = "";
        } else {
            document.getElementById(i).style.display = "none";
        }
    }
}