const Mode = {
    html: document.querySelector("html"),
    active(){
        this.html.classList.add("dark-mode")
    },
    disable(){
        this.html.classList.remove("dark-mode")
    }
}

const ModeButton = {
    LightMode: document.querySelector("#darkModeButton-light"),
    DarkMode: document.querySelector("#darkModeButton-dark"),
    LightModeListener(){
        this.LightMode.addEventListener("click", () => {
            Mode.disable()
        })
    },
    DarkModeListener(){
        this.DarkMode.addEventListener("click", () => {
            Mode.active()
        })
    }

}

const init = () => {
    ModeButton.LightModeListener()
    ModeButton.DarkModeListener()
}

init()



