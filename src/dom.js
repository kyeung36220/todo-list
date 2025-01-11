import { select, create, editText, addClass, append, capitalize, insert, addId } from "./domFunctions"
import checkedSvg from "./assets/checked.svg"
import detailsSvg from "./assets/details.svg"
import editSvg from "./assets/edit.svg"
import filterSvg from "./assets/filter.svg"
import menuImageSvg from "./assets/menu.svg"
import trashSvg from "./assets/trash.svg"
import uncheckedSvg from "./assets/unchecked.svg"

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
        "projects",
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
        addId(item, `project${index}`)
        append(projectNavContainer, item)
    })

}

export function updateMainScreen(list) {
    const mainScreen = select("#mainScreen")
    mainScreen.innerHTML = ""

    list.forEach((item) => {
        const rowContainer = create("div")
        addClass(rowContainer, "rowContainer")
        append(mainScreen, rowContainer)

        const checkBox = create("img")
        addClass(checkBox, "checkBox")
        addClass(checkBox, "rowImage")
        checkBox.src = item.getCompletedStatus === "Completed" ? checkedSvg : uncheckedSvg
        append(rowContainer, checkBox)

        const rowTitle = create("div")
        editText(rowTitle, `${item.getTitle}`)
        addClass(rowTitle, "rowTitle")
        append(rowContainer, rowTitle)

        const rowDueDate = create("div")
        editText(rowDueDate, `${item.getDueDate}`)
        addClass(rowDueDate, "rowDueDate")
        append(rowContainer, rowDueDate)

        const iconList = create("div")
        addClass(iconList, "iconList")
        append(rowContainer, iconList)

        const images = [detailsSvg, editSvg, trashSvg]
        images.forEach((image) => {
            const imageContainer = create("img")
            addClass(imageContainer, "rowImage")
            imageContainer.src = image
            append(iconList, imageContainer)
        })
    })
}