import { select, create, editText, addClass, append, capitalize, insert } from "./domFunctions"
import menuImageSvg from "./assets/menu.svg"

export function initialize() {
    const header = select("#header")

    const menuImage = create("img")
    addClass(menuImage, "menuImage")
    menuImage.src = menuImageSvg
    append(header, menuImage)

    const headerTitle = create("div")
    editText(headerTitle, "todo")
    addClass(headerTitle, "headerTitle")
    append(header, headerTitle)

    const sideBar = select("#sideBar")

    const sideBarLabels = [
        "inbox",
        "today",
        "week",
        "project",
        "notes",
    ]

    sideBarLabels.forEach((text) => {
        const item = create("div")
        editText(item, capitalize(text))
        addClass(item, `${text}Nav`)
        addClass(item, `sideBarChild`)
        append(sideBar, item)
    })

    const projectNavContainer = create("div")
    addClass(projectNavContainer, "projectNavContainer")
    addClass(projectNavContainer, `sideBarChild`)
    insert(sideBar, projectNavContainer, 4)
}

export function updateSideBar(projectList) {
    const projectNavContainer = select(".projectNavContainer")
    projectList.forEach((project, index) => {
        const item = create("div")
        const name = project.getTitle
        editText(item, name)
        addClass(item, "projectNavChild")
        append(projectNavContainer, item)
    })

}

export function updateMainScreen(page) {

}