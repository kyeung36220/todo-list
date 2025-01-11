import { select, create, editText, addClass, append, capitalize, insert, addId } from "./domFunctions"
import { inboxList, todayTasksList, weekTasksList, projectList, noteList } from "./index.js"
import checkedSvg from "./assets/checked.svg"
import detailsSvg from "./assets/details.svg"
import editSvg from "./assets/edit.svg"
import filterdescSvg from "./assets/filterdesc.svg"
import menuImageSvg from "./assets/menu.svg"
import plusOnlySvg from "./assets/plusOnly.svg"
import plusWithCircleSvg from "./assets/plusWithCircle.svg"
import trashSvg from "./assets/trash.svg"
import uncheckedSvg from "./assets/unchecked.svg"
import exitButtonSvg from "./assets/x.svg"

export function initialize() {
    const body = select("body")
    const header = select("#header")
    const sideBar = select("#sideBar")

    const menuImage = create("img")
    addClass(menuImage, "menuImage")
    menuImage.src = menuImageSvg
    menuImage.addEventListener("click", () => {
        if (sideBar.innerHTML === "") {
            body.style.gridTemplateColumns = "1fr 4fr"
            body.style.gridTemplateAreas = "'header header''sideBar mainScreen'"
            sideBar.style.padding = "clamp(35px, 35px, 4vh) clamp(10px,10px,1vw) 0px clamp(10px,10px,1vw)"
            addSideBar()
            return
        }
        sideBar.innerHTML = ""
        body.style.gridTemplateColumns = "4fr"
        body.style.gridTemplateAreas = "'header''mainScreen'"
        sideBar.style.padding = "0"
    })

    append(header, menuImage)

    const headerTitle = create("div")
    editText(headerTitle, "todo")
    addClass(headerTitle, "headerTitle")
    append(header, headerTitle)

    addSideBar()

}

export function updateSideBar(projectList) {
    const projectNavContainer = select(".projectNavContainer")
    projectList.forEach((project, index) => {
        const item = create("div")
        const name = project.getTitle
        editText(item, name)
        addClass(item, "projectNavChild")
        addId(item, `project-${index}`)

        item.addEventListener("click", () => {
            const projectIndex = item.getAttribute("id").split("-")[1]
            const project = projectList[projectIndex]
            const projectItems = project.getItems
            updateMainScreen(projectItems, project.getTitle)
        })

        append(projectNavContainer, item)
    })

}

export function updateMainScreen(list, title) {
    const mainScreen = select("#mainScreen")
    mainScreen.innerHTML = ""

    // add plus button
    const addTaskButton = create("img")
    addClass(addTaskButton, "addTaskButton")
    addTaskButton.src = plusWithCircleSvg
    insert(mainScreen, addTaskButton)

    addTaskButton.addEventListener("click", addProjectWindow)

    const listTitle = create("div")
    addClass(listTitle, "listTitle")
    editText(listTitle, title)
    append(mainScreen, listTitle)

    list.forEach((item, index) => {
        const rowContainer = create("div")
        addClass(rowContainer, "rowContainer")
        addId(rowContainer, `rowIndex${index}`)
        append(mainScreen, rowContainer)
    
        //text
        const rowTitle = create("div")
        editText(rowTitle, `${item.getTitle}`)
        addClass(rowTitle, "rowTitle")
        append(rowContainer, rowTitle)
    
        //if project list, no other icons & text necessary
        if (title === "Projects") {
            addId(rowTitle, `projectTitle-${index}`)
            addClass(rowTitle, `projectTitle`)
            rowTitle.addEventListener("click", () => {
                const projectIndex = rowTitle.getAttribute("id").split("-")[1]
                const project = projectList[projectIndex]
                const projectItems = project.getItems
                updateMainScreen(projectItems, project.getTitle)
            })
            createIcons(rowContainer, `projects`)
            return
        }

        const rowDueDate = create("div")
        editText(rowDueDate, `${item.getDueDate}`)
        addClass(rowDueDate, "rowDueDate")
        append(rowContainer, rowDueDate)

        //checkbox
        const checkBox = create("img")
        addClass(checkBox, "checkBox")
        addClass(checkBox, "rowIcon")
        checkBox.src = item.getCompletedStatus === "Completed" ? checkedSvg : uncheckedSvg
        insert(rowContainer, checkBox, 0)

        checkBox.addEventListener("click", () => {
            item.toggleCompleteStatus()
            checkBox.src = item.getCompletedStatus === "Completed" ? checkedSvg : uncheckedSvg
        })

        //icons
        createIcons(rowContainer, `normal`, item)
    })
}

function addSideBarButtonFunctionality() {

    const inboxButton = document.querySelector(".inboxNav")
    inboxButton.addEventListener("click", () => {
        updateMainScreen(inboxList, "Inbox")
        return
    })

    const todayButton = document.querySelector(".todayNav")
    todayButton.addEventListener("click", () => {
        updateMainScreen(todayTasksList, "Today")
        return
    })


    const weekButton = document.querySelector(".weekNav")
    weekButton.addEventListener("click", () => {
        updateMainScreen(weekTasksList, "Week")
        return
    })

    const projectsButton = document.querySelector(".projectsNav")
    projectsButton.addEventListener("click", () => {
        updateMainScreen(projectList, "Projects")
        return
    })
}

function addSideBar() {
    const sideBar = document.querySelector("#sideBar")
    const sideBarLabels = [
        "inbox",
        "today",
        "week",
    ]

    sideBarLabels.forEach((text) => {
        const item = create("div")
        editText(item, capitalize(text))
        addClass(item, `${text}Nav`)
        addClass(item, `sideBarChild`)
        append(sideBar, item)
    })

    const projectTitleContainer = create("div")
    addId(projectTitleContainer, "projectTitleContainer")
    append(sideBar, projectTitleContainer)

    const projectTitle = create("div")
    editText(projectTitle, "Projects")
    addClass(projectTitle, `projectsNav`)
    append(projectTitleContainer, projectTitle)

    const projectAddButton = create("img")
    addClass(projectAddButton, "projectAddButton")
    projectAddButton.src = plusOnlySvg
    append(projectTitleContainer, projectAddButton)

    const projectNavContainer = create("div")
    addClass(projectNavContainer, "projectNavContainer")
    addClass(projectNavContainer, `sideBarChild`)
    append(sideBar, projectNavContainer)
    updateSideBar(projectList)

    addSideBarButtonFunctionality()
}

function createIcons(parent, page, item) {
    const iconList = create("div")
    addClass(iconList, "iconList")
    append(parent, iconList)

    if (page === "normal") {
        const details = create("img")
        addClass(details, `rowIcon`)
        addClass(details, `detailsIcon`)
        details.src = detailsSvg
        append(iconList, details)

        details.addEventListener("click", () => {
            seeDetails(item)
        })

        const edit = create("img")
        addClass(edit, `rowIcon`)
        addClass(edit, `editIcon`)
        edit.src = editSvg
        append(iconList, edit)

    }

    const trash = create("img")
    addClass(trash, `rowIcon`)
    addClass(trash, `trashIcon`)
    trash.src = trashSvg
    append(iconList, trash)
}

function seeDetails(item) {
    const body = document.querySelector("body")

    const detailsWindow = document.createElement("div")
    addClass(detailsWindow, "detailsWindow")
    addClass(detailsWindow, "window")
    append(body, detailsWindow)

    const existingDetailsWindow = document.querySelector(".detailsWindow")
    if (existingDetailsWindow.innerHTML != "") {
        detailsWindow.remove()
        return
    }

    const textContainer = document.createElement("div")
    addClass(textContainer, `detailsTextContainer`)
    append(detailsWindow, textContainer)

    const exitButton = document.createElement("img")
    addClass(exitButton, `exitButton`)
    exitButton.src = exitButtonSvg
    exitButton.addEventListener("click", () => {detailsWindow.remove()})
    append(detailsWindow, exitButton)

    const titleText = document.createElement("div")
    addClass(titleText, "titleText")
    addClass(titleText, `detailsWindowText`)
    editText(titleText, item.getTitle)
    append(textContainer, titleText)

    const descText = document.createElement("div")
    addClass(descText, "descText")
    addClass(descText, `detailsWindowText`)
    editText(descText, `Description: ${item.getDescription}`)
    append(textContainer, descText)

    const dueDateText = document.createElement("div")
    addClass(dueDateText, "dueDateText")
    addClass(dueDateText, `detailsWindowText`)
    editText(dueDateText, `Due Date: ${item.getDueDate}`)
    append(textContainer, dueDateText)

    const priorityText = document.createElement("div")
    addClass(priorityText, "priorityText")
    addClass(priorityText, `detailsWindowText`)
    editText(priorityText, `Priority: ${item.getPriority}`)
    append(textContainer, priorityText)

    const completedStatusText = document.createElement("div")
    addClass(completedStatusText, "completedStatusText")
    addClass(completedStatusText, `detailsWindowText`)
    editText(completedStatusText, `Completed Status: ${item.getCompletedStatus}`)
    append(textContainer, completedStatusText)

}

function addProjectWindow() {
    
}