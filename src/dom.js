import { select, create, editText, addClass, removeClass, append, capitalize, insert, addId } from "./domFunctions"
import { inboxList, todayTasksList, weekTasksList, projectList, noteList, addItemToInbox, addProjectToProjectList } from "./index.js"
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
import checkmarkSvg from "./assets/checkmark.svg"

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
    projectNavContainer.innerHTML = ""
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

    addTaskButton.addEventListener("click", addTaskWindow)

    const listTitle = create("div")
    addClass(listTitle, "listTitle")
    editText(listTitle, title)
    append(mainScreen, listTitle)

    list.forEach((item, index) => {
        const rowContainer = create("div")
        addClass(rowContainer, "rowContainer")
        addId(rowContainer, `rowIndex-${index}`)
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

        rowTitle.addEventListener("click", () => {
            seeDetails(item)
        })
    
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
        createIcons(rowContainer, title, item, list)
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

    projectAddButton.addEventListener("click", () => {
        addProjectAddButtonFunctionality()
    })

    const projectNavContainer = create("div")
    addClass(projectNavContainer, "projectNavContainer")
    addClass(projectNavContainer, `sideBarChild`)
    append(sideBar, projectNavContainer)
    updateSideBar(projectList)

    addSideBarButtonFunctionality()
}

function createIcons(parent, title, item, list) {
    const iconList = create("div")
    addClass(iconList, "iconList")
    append(parent, iconList)

    if (title != "projects") {
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

    trash.addEventListener("click", () => {
        const rowId= trash.parentElement.parentElement.getAttribute("id")
        const rowIndex = rowId.split("-")[1]
        list.splice(rowIndex, 1)
        updateMainScreen(list, title)
    })
}

function seeDetails(item) {
    const body = document.querySelector("body")

    const detailsWindow = document.createElement("dialog")
    addClass(detailsWindow, "detailsWindow")
    addClass(detailsWindow, "window")
    append(body, detailsWindow)
    detailsWindow.showModal()

    const textContainer = document.createElement("div")
    addClass(textContainer, `detailsTextContainer`)
    append(detailsWindow, textContainer)

    const exitButton = document.createElement("img")
    addClass(exitButton, `exitButton`)
    exitButton.src = exitButtonSvg
    exitButton.addEventListener("click", () => {
        detailsWindow.remove()
    })
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

function addTaskWindow() {

    const body = document.querySelector("body")
    const window = document.createElement("dialog")
    addClass(window, "addTaskWindow")
    addClass(window, "window")
    append(body, window)
    window.showModal()

    const exitButton = document.createElement("div")
    addClass(exitButton, `exitButton`)
    append(window, exitButton)

    const formContainer = document.createElement("form")
    addClass(formContainer, `addTaskFormContainer`)
    append(window, formContainer)

    const titleText = document.createElement("div")
    addClass(titleText, "titleText")
    editText(titleText, "Add Task")
    append(formContainer, titleText)

    // task title
    const inputRowContainer = document.createElement("div")
    addClass(inputRowContainer, "inputRowContainer")
    append(formContainer, inputRowContainer)

    const inputTaskLabel = document.createElement("span")
    addClass(inputTaskLabel, "inputTaskLabel")
    addClass(inputTaskLabel, "label")
    editText(inputTaskLabel, "Task Name:")
    append(inputRowContainer, inputTaskLabel)

    const inputTaskName = document.createElement('input')
    addClass(inputTaskName, "input")
    inputTaskName.type = 'text'
    inputTaskName.name = 'taskName'
    inputTaskName.placeholder = 'Task Name'
    append(inputRowContainer, inputTaskName)

    // description
    const inputRowContainer2 = document.createElement("div")
    addClass(inputRowContainer2, "inputRowContainer")
    append(formContainer, inputRowContainer2)

    const inputDescLabel = document.createElement("span")
    addClass(inputDescLabel, "inputDescLabel")
    addClass(inputDescLabel, "label")
    editText(inputDescLabel, "Task Description:")
    append(inputRowContainer2, inputDescLabel)

    const inputDesc = document.createElement('textarea')
    addClass(inputDesc, "textArea")
    inputDesc.name = 'taskDesc'
    inputDesc.placeholder = 'Task Description'
    inputDesc.rows ="3"
    inputDesc.cols = "25"
    append(inputRowContainer2, inputDesc)

    // due date
    const inputRowContainer3 = document.createElement("div")
    addClass(inputRowContainer3, "inputRowContainer")
    append(formContainer, inputRowContainer3)

    const inputDueDateLabel = document.createElement("span")
    addClass(inputDueDateLabel, "inputDueDateLabel")
    addClass(inputDueDateLabel, "label")
    editText(inputDueDateLabel, "Task Due Date:")
    append(inputRowContainer3, inputDueDateLabel)

    const inputDueDate = document.createElement('input')
    addClass(inputDueDate, "input")
    inputDueDate.type = 'date'
    inputDueDate.name = 'taskDueDate'
    inputDueDate.placeholder = 'Due Date'
    append(inputRowContainer3, inputDueDate)

    // priority dropdown
    const inputPriority = document.createElement('div');
    addClass(inputPriority, "inputPriority")
    append(formContainer, inputPriority)

    const inputPriorityLabel = document.createElement("span")
    addClass(inputPriorityLabel, "inputPriorityLabel")
    editText(inputPriorityLabel, "Priority:")
    append(inputPriority, inputPriorityLabel)

    const priorityList = document.createElement("select")
    addClass(priorityList, "priorityList")
    addClass(priorityList, "list")
    priorityList.name = "Priority"
    append(inputPriority, priorityList)

    const priorityLow = document.createElement("option")
    priorityLow.value = "Low"
    editText(priorityLow, "Low")
    append(priorityList, priorityLow)

    const priorityMed = document.createElement("option")
    priorityMed.value = "Medium"
    editText(priorityMed, "Medium")
    append(priorityList, priorityMed)

    const priorityHigh = document.createElement("option")
    priorityHigh.value = "High"
    editText(priorityHigh, "High")
    append(priorityList, priorityHigh)

    // category dropdown
    const inputCategory = document.createElement('div');
    addClass(inputCategory, "inputCategory")
    append(formContainer, inputCategory)

    const inputCategoryLabel = document.createElement("span")
    addClass(inputCategoryLabel, "inputCategoryLabel")
    editText(inputCategoryLabel, "Category:")
    append(inputCategory, inputCategoryLabel)

    const categoryList = document.createElement("select")
    addClass(categoryList, "categoryList")
    addClass(categoryList, "list")
    categoryList.name = "Category"
    append(inputCategory, categoryList)

    const inbox = document.createElement("option")
    inbox.value = "inbox"
    editText(inbox, "Inbox")
    append(categoryList, inbox)

    projectList.forEach((project) => {
        const choice = document.createElement("option")
        choice.value = `projectIndex-${project.getIndex}`
        editText(choice, `${project.getTitle}`)
        append(categoryList, choice)
    })

    // Add and Cancel Button
    const buttonContainer = document.createElement("div")
    addClass(buttonContainer, "buttonContainer")
    append(formContainer, buttonContainer)

    const addButton = document.createElement("div")
    addClass(addButton, "addButton")
    addClass(addButton, "button")
    editText(addButton, "Add Task")
    append(buttonContainer, addButton)

    addButton.addEventListener("click", () => {

        const name = inputTaskName.value
        const description = inputDesc.value
        const dueDate = inputDueDate.value
        const priority = priorityList.value
        const category = categoryList.value

        const asterisk = document.createElement("span")
        editText(asterisk, "*")

        if (name === "") {
            if (inputTaskLabel.childNodes.length > 1 === true) {
                return
            }
            append(inputTaskLabel, asterisk)
            asterisk.style.color = "red"
            inputTaskName.style.border = "2px solid red"
            return
        }

        inputTaskLabel.style.color = "white"
        inputTaskName.style.border = ""

        if (dueDate === "") {
            if (inputDueDateLabel.childNodes.length > 1 === true) {
                return
            }
            append(inputDueDateLabel, asterisk)
            asterisk.style.color = "red"
            inputDueDate.style.border = "2px solid red"
            return
        }

        inputDueDateLabel.style.color = "white"
        inputDueDate.style.border = ""
        
        if (category === "inbox") {
            addItemToInbox(name, description, dueDate, priority, "Not Completed")
            updateMainScreen(inboxList, "Inbox")
            window.remove()
            return
        }

        else {
            const projectIndex = category.split("-")[1]
            const project = projectList[projectIndex]
            project.addItem(name, description, dueDate, priority, "Not Completed", projectIndex)
            window.remove()
            updateMainScreen(project.getItems, project.getTitle)
            return
        }
    })

    const cancelButton = document.createElement("div")
    addClass(cancelButton, "cancelButton")
    addClass(cancelButton, "button")
    editText(cancelButton, "Cancel")
    append(buttonContainer, cancelButton)

    cancelButton.addEventListener("click", () => {
        window.remove()
    })
}

function addProjectAddButtonFunctionality() {
    const sideBar = document.querySelector("#sideBar")

    const inputContainer = document.createElement("div")
    addClass(inputContainer, "projectNavChild")
    addId(inputContainer, "projectNavInputContainer")
    append(sideBar, inputContainer)

    const nameInput = document.createElement("input")
    addClass(nameInput, `nameInput`)
    append(inputContainer, nameInput)

    const checkmark = document.createElement("img")
    addClass(checkmark, `checkmark`)
    checkmark.src = checkmarkSvg
    append(inputContainer, checkmark)

    checkmark.addEventListener("click", () => {
        if (nameInput.value === "") {
            inputContainer.remove()
            return
        }

        const newProjectName = nameInput.value
        addProjectToProjectList(newProjectName)
        inputContainer.remove()
        updateSideBar(projectList)

    })
}