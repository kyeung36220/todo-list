import { select, create, editText, addClass, append, capitalize, insert, addId, editValue, getId } from "./domFunctions"
import { inboxList, todayTasksList, weekTasksList, projectList, addItemToInbox, addProjectToProjectList, updateTodayAndWeekLists, updateLocalStorage } from "./index.js"
import checkedSvg from "./assets/checked.svg"
import detailsSvg from "./assets/details.svg"
import editSvg from "./assets/edit.svg"
import menuImageSvg from "./assets/menu.svg"
import plusOnlySvg from "./assets/plusOnly.svg"
import plusWithCircleSvg from "./assets/plusWithCircle.svg"
import trashSvg from "./assets/trash.svg"
import uncheckedSvg from "./assets/unchecked.svg"
import exitButtonSvg from "./assets/x.svg"
import checkmarkSvg from "./assets/checkmark.svg"

let currentPage = "Inbox"

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
            sideBar.style.padding = "clamp(35px, 35px, 4vh) clamp(60px,60px,5vw) 0px clamp(10px,10px,1vw)"
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
    updateLocalStorage()
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
            currentPage = project.getTitle
            updateMainScreen()
        })

        append(projectNavContainer, item)
    })

}

export function updateMainScreen() {
    updateLocalStorage()
    const mainScreen = select("#mainScreen")
    mainScreen.innerHTML = ""

    // add plus button
    const addTaskButton = create("img")
    addClass(addTaskButton, "addTaskButton")
    addTaskButton.src = plusWithCircleSvg
    insert(mainScreen, addTaskButton)
    addTaskButton.addEventListener("click", addTaskWindow)

    let projectIndex
    let list
    let title

    if (["Inbox", "Today", "Week", "Projects"].includes(currentPage) === false) {
        const project = findProject(currentPage)
        list = project.getItems
        title = project.getTitle
        projectIndex = project.getIndex
    }
    else if (arguments[0] === "projectItemClicked") {
        const project = arguments[1]
        list = project.getItems
        title = project.getTitle
        projectIndex = project.getIndex
    }
    else {
        list = findProject(currentPage)
        title = currentPage
        projectIndex = currentPage
    }

    const listTitle = create("div")
    addClass(listTitle, "listTitle")
    editText(listTitle, title)
    append(mainScreen, listTitle)

    list.forEach((item, index) => {
        const rowContainer = create("div")
        addClass(rowContainer, "rowContainer")
        addId(rowContainer, `project-${projectIndex}-itemIndex-${index}`)
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
                const projectIndex = getId(rowTitle).split("-")[1]
                console.log(projectIndex)
                const project = projectList[projectIndex]
                const projectItems = project.getItems
                updateMainScreen("projectItemClicked", project)
            })
            createIcons(rowContainer, `Projects`, item, projectList)
            return
        }

        rowTitle.addEventListener("click", () => {
            seeDetails(item)
        })
    
        const rowDueDate = create("div")
        editText(rowDueDate, `${item.UIDueDate}`)
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

    const inboxButton = select(".inboxNav")
    inboxButton.addEventListener("click", () => {
        currentPage = "Inbox"
        updateMainScreen()
        return
    })

    const todayButton = select(".todayNav")
    todayButton.addEventListener("click", () => {
        updateTodayAndWeekLists()
        currentPage = "Today"
        updateMainScreen()
        return
    })


    const weekButton = select(".weekNav")
    weekButton.addEventListener("click", () => {
        updateTodayAndWeekLists()
        currentPage = "Week"
        updateMainScreen()
        return
    })

    const projectsButton = select(".projectsNav")
    projectsButton.addEventListener("click", () => {
        currentPage = "Projects"
        updateMainScreen()
        return
    })
}

function addSideBar() {
    const sideBar = select("#sideBar")
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

    if (title != "Projects") {
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

        edit.addEventListener("click", (e) => {
            editTask(e, item)
        })

    }

    const trash = create("img")
    addClass(trash, `rowIcon`)
    addClass(trash, `trashIcon`)
    trash.src = trashSvg
    append(iconList, trash)

    trash.addEventListener("click", () => {
        const rowId= trash.parentElement.parentElement.getAttribute("id")
        const rowIndex = rowId.split("-")[3]
        list.splice(rowIndex, 1)
        updateMainScreen()
        updateSideBar(projectList)
    })
}

function seeDetails(item) {
    const body = select("body")

    const detailsWindow = create("dialog")
    addClass(detailsWindow, "detailsWindow")
    addClass(detailsWindow, "window")
    append(body, detailsWindow)
    detailsWindow.showModal()

    const exitButton = create("img")
    addClass(exitButton, `exitButton`)
    exitButton.src = exitButtonSvg
    exitButton.addEventListener("click", () => {
        detailsWindow.remove()
    })
    append(detailsWindow, exitButton)

    const textContainer = create("div")
    addClass(textContainer, `detailsTextContainer`)
    append(detailsWindow, textContainer)

    const titleText = create("div")
    addClass(titleText, "titleText")
    addClass(titleText, `detailsWindowText`)
    editText(titleText, item.getTitle)
    append(textContainer, titleText)

    const dueDateLabel = create("div")
    addClass(dueDateLabel, `detailsWindowText`)
    editText(dueDateLabel, `Due Date: `)
    dueDateLabel.style.fontWeight = "bold"
    append(textContainer, dueDateLabel)

    const dueDateText = create("span")
    editText(dueDateText, `${item.UIDueDate}`)
    dueDateText.style.fontWeight = "normal"
    append(dueDateLabel, dueDateText)

    const priorityLabel = create("div")
    addClass(priorityLabel, `detailsWindowText`)
    editText(priorityLabel, `Priority: `)
    priorityLabel.style.fontWeight = "bold"
    append(textContainer, priorityLabel)

    const priorityText = create("span")
    editText(priorityText, `${item.getPriority}`)
    priorityText.style.fontWeight = "normal"
    append(priorityLabel, priorityText)

    const completedStatusLabel = create("div")
    addClass(completedStatusLabel, `detailsWindowText`)
    editText(completedStatusLabel, `Completed Status: `)
    completedStatusLabel.style.fontWeight = "bold"
    append(textContainer, completedStatusLabel)

    const completedStatusText = create("span")
    editText(completedStatusText, `${item.getCompletedStatus}`)
    completedStatusText.style.fontWeight = "normal"
    append(completedStatusLabel, completedStatusText)

    const descLabel = create("div")
    addClass(descLabel, `detailsWindowText`)
    editText(descLabel, `Description: `)
    descLabel.style.fontWeight = "bold"
    append(textContainer, descLabel)

    const descText = create("span")
    editText(descText, `${item.getDescription}`)
    descText.style.fontWeight = "normal"
    append(descLabel, descText)

}

function editTask(e, item) {
    addTaskWindow()
    const itemIndex = getId(e.target.parentElement.parentElement).split("-")[1]
    const window = select(".window")
    const titleText = select(".titleText")
    const inputTaskName = select(".inputTaskName")
    const inputDesc = select(".inputTaskDesc")
    const inputDueDate = select(".inputDueDate")
    const priorityList = select(".priorityList")
    const categoryList = select(".categoryList")
    const originalAddButton = select(".addButton")
    const buttonContainer = select(".buttonContainer")

    editText(titleText, "Edit Task")
    editValue(inputTaskName, item.getTitle)
    editValue(inputDesc, item.getDescription)
    editValue(inputDueDate, item.getDueDate)

    for (let option of priorityList.options) {
        if (option.value === item.getPriority) {
            option.selected = true
            break
        }
    }

    const project = findProject(currentPage)
    const projectIndex = project.getIndex
    for (let option of categoryList.options) {
        if (option.value.split("-")[1] == projectIndex) {
            option.selected = true
            break
        }
    }

    originalAddButton.remove()
    const editButton = create("div")
    addClass(editButton, "editButton")
    addClass(editButton, "button")
    editText(editButton, "Edit Task")
    insert(buttonContainer, editButton, 0)

    editButton.addEventListener("click", () => {
        item.changeTitle = inputTaskName.value
        item.changeDescription = inputDesc.value
        item.changeDueDate = inputDueDate.value
        item.changePriority = priorityList.value

        if (categoryList.value != currentPage) {
            if (currentPage === "Inbox") {
                inboxList.splice(itemIndex, 1)
            }
            else {
                projectList[projectIndex].getItems.splice(itemIndex, 1)
            }
            if (categoryList.value === "Inbox") {
                inboxList.push(item)
            }
            else {
                const newProject = findProject(categoryList.value.split("-")[2])
                newProject.addItem(item.getTitle, item.getDescription, item.getDueDate, item.getPriority, "Not Completed", newProject.getIndex)
            }
        }

        if (currentPage === "Inbox"){
            updateMainScreen()
        }
        else {
            updateMainScreen()
        }
        window.remove()
        
    })
    
}

function addTaskWindow() {

    const body = select("body")
    const window = create("dialog")
    addClass(window, "addTaskWindow")
    addClass(window, "window")
    append(body, window)
    window.showModal()

    const exitButton = create("div")
    addClass(exitButton, `exitButton`)
    append(window, exitButton)

    const formContainer = create("form")
    addClass(formContainer, `addTaskFormContainer`)
    append(window, formContainer)

    const titleText = create("div")
    addClass(titleText, "titleText")
    editText(titleText, "Add Task")
    append(formContainer, titleText)

    // task title
    const inputRowContainer = create("div")
    addClass(inputRowContainer, "inputRowContainer")
    append(formContainer, inputRowContainer)

    const inputTaskLabel = create("span")
    addClass(inputTaskLabel, "inputTaskLabel")
    addClass(inputTaskLabel, "label")
    editText(inputTaskLabel, "Task Name:")
    append(inputRowContainer, inputTaskLabel)

    const inputTaskName = create('input')
    addClass(inputTaskName, "input")
    addClass(inputTaskName, "inputTaskName")
    inputTaskName.type = 'text'
    inputTaskName.name = 'taskName'
    inputTaskName.placeholder = 'Task Name'
    append(inputRowContainer, inputTaskName)

    // description
    const inputRowContainer2 = create("div")
    addClass(inputRowContainer2, "inputRowContainer")
    append(formContainer, inputRowContainer2)

    const inputDescLabel = create("span")
    addClass(inputDescLabel, "inputDescLabel")
    addClass(inputDescLabel, "label")
    editText(inputDescLabel, "Task Description:")
    append(inputRowContainer2, inputDescLabel)

    const inputDesc = create('textarea')
    addClass(inputDesc, "textArea")
    addClass(inputDesc, "inputTaskDesc")
    inputDesc.name = 'taskDesc'
    inputDesc.placeholder = 'Task Description'
    inputDesc.rows ="3"
    inputDesc.cols = "25"
    append(inputRowContainer2, inputDesc)

    // due date
    const inputRowContainer3 = create("div")
    addClass(inputRowContainer3, "inputRowContainer")
    append(formContainer, inputRowContainer3)

    const inputDueDateLabel = create("span")
    addClass(inputDueDateLabel, "inputDueDateLabel")
    addClass(inputDueDateLabel, "label")
    editText(inputDueDateLabel, "Task Due Date:")
    append(inputRowContainer3, inputDueDateLabel)

    const inputDueDate = create('input')
    addClass(inputDueDate, "input")
    addClass(inputDueDate, "inputDueDate")
    inputDueDate.type = 'date'
    inputDueDate.name = 'taskDueDate'
    inputDueDate.placeholder = 'Due Date'
    append(inputRowContainer3, inputDueDate)

    // priority dropdown
    const inputPriority = create('div');
    addClass(inputPriority, "inputPriority")
    append(formContainer, inputPriority)

    const inputPriorityLabel = create("span")
    addClass(inputPriorityLabel, "inputPriorityLabel")
    editText(inputPriorityLabel, "Priority:")
    append(inputPriority, inputPriorityLabel)

    const priorityList = create("select")
    addClass(priorityList, "priorityList")
    addClass(priorityList, "list")
    priorityList.name = "Priority"
    append(inputPriority, priorityList)

    const priorityLow = create("option")
    editValue(priorityLow, "Low")
    editText(priorityLow, "Low")
    append(priorityList, priorityLow)

    const priorityMed = create("option")
    editValue(priorityMed, "Medium")
    editText(priorityMed, "Medium")
    append(priorityList, priorityMed)

    const priorityHigh = create("option")
    editValue(priorityHigh, "High")
    editText(priorityHigh, "High")
    append(priorityList, priorityHigh)

    // category dropdown
    const inputCategory = create('div');
    addClass(inputCategory, "inputCategory")
    append(formContainer, inputCategory)

    const inputCategoryLabel = create("span")
    addClass(inputCategoryLabel, "inputCategoryLabel")
    editText(inputCategoryLabel, "Category:")
    append(inputCategory, inputCategoryLabel)

    const categoryList = create("select")
    addClass(categoryList, "categoryList")
    addClass(categoryList, "list")
    categoryList.name = "Category"
    append(inputCategory, categoryList)

    const inbox = create("option")
    editValue(inbox, "Inbox")
    editText(inbox, "Inbox")
    append(categoryList, inbox)

    projectList.forEach((project) => {
        const choice = create("option")
        editValue(choice, `projectIndex-${project.getIndex}-${project.getTitle}`)
        editText(choice, `${project.getTitle}`)
        append(categoryList, choice)
    })

    // Add and Cancel Button
    const buttonContainer = create("div")
    addClass(buttonContainer, "buttonContainer")
    append(formContainer, buttonContainer)

    const addButton = create("div")
    addClass(addButton, "addButton")
    addClass(addButton, "button")
    editText(addButton, "Add Task")
    append(buttonContainer, addButton)

    addButton.addEventListener("click", function addItem() {

        const name = inputTaskName.value
        const description = inputDesc.value
        const dueDate = inputDueDate.value
        const priority = priorityList.value
        const category = categoryList.value

        const asterisk = create("span")
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
        
        if (category === "Inbox") {
            addItemToInbox(name, description, dueDate, priority, "Not Completed")
            updateMainScreen()
            window.remove()
            return
        }

        else {
            const projectIndex = category.split("-")[1]
            const project = projectList[projectIndex]
            project.addItem(name, description, dueDate, priority, "Not Completed", projectIndex)
            window.remove()
            updateMainScreen()
            return
        }
    })

    const cancelButton = create("div")
    addClass(cancelButton, "cancelButton")
    addClass(cancelButton, "button")
    editText(cancelButton, "Cancel")
    append(buttonContainer, cancelButton)

    cancelButton.addEventListener("click", () => {
        window.remove()
    })
}

function addProjectAddButtonFunctionality() {
    const sideBar = select("#sideBar")

    const inputContainer = create("div")
    addClass(inputContainer, "projectNavChild")
    addId(inputContainer, "projectNavInputContainer")
    append(sideBar, inputContainer)

    const nameInput = create("input")
    addClass(nameInput, `nameInput`)
    nameInput.placeholder = "Project Name"
    append(inputContainer, nameInput)

    const iconContainer = create("div")
    addClass(iconContainer, "iconContainer")
    append(inputContainer, iconContainer)

    const checkmark = create("img")
    addClass(checkmark, `checkmark`)
    checkmark.src = checkmarkSvg
    append(iconContainer, checkmark)

    checkmark.addEventListener("click", () => {
        if (nameInput.value === "") {
            inputContainer.remove()
            return
        }

        if (nameInput.value.length > 15) {
            alert("Project Name can not be over 15 characters.")
            nameInput.value = ""
            return
        }

        if (["Index", "Today", "Week", "Projects"].includes(nameInput.value)) {
            alert("Project Name can not be a default.")
            nameInput.value = ""
            return
        }

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].getTitle === nameInput.value) {
                alert("Project Name already exists!")
                nameInput.value = ""
                return
            }
        }

        const newProjectName = nameInput.value
        addProjectToProjectList(newProjectName)
        inputContainer.remove()
        updateSideBar(projectList)

        if (currentPage === "Projects") {
            updateMainScreen()
        }

    })

    const xIcon = create("img")
    addClass(xIcon, `xIcon`)
    xIcon.src = exitButtonSvg
    append(iconContainer, xIcon)

    xIcon.addEventListener("click", () => {
        inputContainer.remove()
    })
}

function findProject(projectName) {

    if (projectName === "Inbox") {
        return inboxList
    }
    else if (projectName === "Projects") {
        return projectList
    }
    else if (projectName === "Today") {
        return todayTasksList
    }
    else if (projectName === "Week") {
        return weekTasksList
    }

    for (let i = 0; i < projectList.length; i++) {
        let project = projectList[i]
        if (project.getTitle === projectName) {
            return project
        }
    }
}