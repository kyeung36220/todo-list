import { select, create, editText, addClass, append, capitalize, insert, addId, editValue, getId, removeClass } from "./domFunctions"
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

    const menuImage = createUIItem("menuImage", "img", [], header)
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

    const headerTitle = createUIItem("headerTitle", "div", [], header)
    editText(headerTitle, "todo")

    headerTitle.addEventListener("click", () => {
        localStorage.clear()
        location.reload()

    })

    addSideBar()
}

export function updateSideBar(projectList) {
    updateLocalStorage()

    const projectNavContainer = select(".projectNavContainer")
    projectNavContainer.innerHTML = ""
    projectList.forEach((project, index) => {
        const item = createUIItem("projectNavChild", "div", [], projectNavContainer)
        editText(item, project.getTitle)
        addId(item, `project-${index}`)

        item.addEventListener("click", () => {
            const projectIndex = item.getAttribute("id").split("-")[1]
            currentPage = projectList[projectIndex].getTitle
            updateMainScreen()
        })
    })

}

export function updateMainScreen() {
    updateLocalStorage()
    const mainScreen = select("#mainScreen")
    mainScreen.innerHTML = ""

    // add plus button
    const addTaskButton = createUIItem("addTaskButton", "img", [], mainScreen)
    addTaskButton.src = plusWithCircleSvg
    addTaskButton.addEventListener("click", addTaskWindow)

    let projectIndex
    let list
    let title

    if (["Inbox", "Today", "Week", "Projects"].includes(currentPage) === false) {
        const project = findProjectThroughProjectName(currentPage)
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
        list = findProjectThroughProjectName(currentPage)
        title = currentPage
        projectIndex = currentPage
    }

    const listContainer = createUIItem("listContainer", "div", [], mainScreen)

    const listTitle = createUIItem("listTitle", "div", [], listContainer)
    editText(listTitle, title)

    list.forEach((item, index) => {
        const rowContainer = createUIItem("rowContainer", "div", [], listContainer)
        addId(rowContainer, `project-${projectIndex}-itemIndex-${index}`)

        //text
        const rowTitle = createUIItem("rowTitle", "div", [], rowContainer)
        editText(rowTitle, `${item.getTitle}`)
    
        //if project list, no other icons & text necessary
        if (title === "Projects") {
            addId(rowTitle, `projectTitle-${index}`)
            addClass(rowTitle, `projectTitle`)
            addClass(rowContainer, "projectListRowContainer")

            rowTitle.addEventListener("click", () => {
                const projectIndex = getId(rowTitle).split("-")[1]
                updateMainScreen("projectItemClicked", projectList[projectIndex])
            })

            createIcons(rowContainer, `Projects`, item, projectList)
            return
        }

        rowTitle.addEventListener("click", () => {
            seeDetails(item)
        })
    
        const rowDueDate = createUIItem("rowDueDate", "div", [], rowContainer)
        editText(rowDueDate, `${item.UIDueDate}`)
        if (item.getPriority === "Low") {
            rowDueDate.style.border = "4px solid rgb(1, 196, 1)"
        }
        else if (item.getPriority === "Medium") {
            rowDueDate.style.border = "4px solid rgb(216, 224, 1)"
        }
        else if (item.getPriority === "High") {
            rowDueDate.style.border = "4px solid rgb(224, 1, 1)"
        }

        //checkbox
        const checkBox = createUIItem("checkBox", "img", ["rowIcon"], "")
        checkBox.src = item.getCompletedStatus === "Completed" ? checkedSvg : uncheckedSvg
        insert(rowContainer, checkBox, 0)

        checkBox.addEventListener("click", () => {
            item.toggleCompleteStatus()
            checkBox.src = item.getCompletedStatus === "Completed" ? checkedSvg : uncheckedSvg
            rowTitle.style.textDecoration = item.getCompletedStatus === "Completed" ? "line-through" : ""
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
        const item = createUIItem("itemSideBarLabels", "div", [`${text}Nav`,`sideBarChild`], sideBar)
        editText(item, capitalize(text))
    })

    const projectTitleContainer = createUIItem("projectTitleContainer", "div", [], sideBar)
    addId(projectTitleContainer, "projectTitleContainer")

    const projectTitle = createUIItem("projectSideBarTitle", "div", [`projectsNav`], projectTitleContainer)
    editText(projectTitle, "Projects")

    const projectAddButton = createUIItem("projectAddButton", "img", [], projectTitleContainer)
    projectAddButton.src = plusOnlySvg

    projectAddButton.addEventListener("click", () => {
        addProjectAddButtonFunctionality()
    })

    const projectNavContainer = createUIItem("projectNavContainer", "div", [`sideBarChild`], sideBar)
    updateSideBar(projectList)

    addSideBarButtonFunctionality()
}

function createIcons(parent, title, item, list) {
    const iconList = createUIItem("iconList", "div", [], parent)

    if (title != "Projects") {
        const details = createUIItem("detailsIcon", "img", ["rowIcon"], iconList)
        details.src = detailsSvg

        details.addEventListener("click", () => {
            seeDetails(item)
        })

        const edit = createUIItem("editIcon", "img", ["rowIcon"], iconList)
        edit.src = editSvg

        edit.addEventListener("click", (e) => {
            editTask(e, item)
    })
    }
    else {
        const edit = createUIItem("editIcon", "img", ["rowIcon"], iconList)
        edit.src = editSvg

        edit.addEventListener("click", (e) => {
            editProject(e, item)
    })
    }

    const trash = createUIItem("trashIcon", "img", ["rowIcon"], iconList)
    trash.src = trashSvg

    trash.addEventListener("click", () => {
        const rowId= trash.parentElement.parentElement.getAttribute("id")
        const rowIndex = rowId.split("-")[3]
        if (["Today", "Week"].includes(currentPage)) {
            const originalProject = findProjectThroughProjectName(item.getOriginProject)
            originalProject.getItems.splice(rowIndex, 1)
        }
        list.splice(rowIndex, 1)
        updateMainScreen()
        updateSideBar(projectList)
    })
}

function seeDetails(item) {
    const body = select("body")

    const detailsWindow = createUIItem("detailsWindow", "dialog", ["window"], body)
    detailsWindow.showModal()

    const exitButton = createUIItem("exitButton", "img", [], detailsWindow)
    exitButton.src = exitButtonSvg
    exitButton.addEventListener("click", () => {
        detailsWindow.remove()
    })

    const textContainer = createUIItem("detailsTextContainer", "div", [], detailsWindow)

    const titleText = createUIItem("titleText", "div", [`detailsWindowText`], textContainer)
    editText(titleText, item.getTitle)

    const dueDateLabel = createUIItem(`detailsWindowText`, "div", [], textContainer)
    editText(dueDateLabel, `Due Date: `)
    dueDateLabel.style.fontWeight = "bold"

    const dueDateText = createUIItem(``, "span", [], dueDateLabel)
    editText(dueDateText, `${item.UIDueDate}`)
    dueDateText.style.fontWeight = "normal"

    const priorityLabel = createUIItem(`detailsWindowText`, "div", [], textContainer)
    editText(priorityLabel, `Priority: `)
    priorityLabel.style.fontWeight = "bold"

    const priorityText = createUIItem(``, "span", [], priorityLabel)
    editText(priorityText, `${item.getPriority}`)
    priorityText.style.fontWeight = "normal"
    if (item.getPriority === "Low") {
        priorityText.style.color = "rgb(0, 132, 0)"
    }
    else if (item.getPriority === "Medium") {
        priorityText.style.color = "rgb(216, 224, 1)"
    }
    else if (item.getPriority === "High") {
        priorityText.style.color = "rgb(224, 1, 1)"
    }

    const completedStatusLabel = createUIItem(`detailsWindowText`, "div", [], textContainer)
    editText(completedStatusLabel, `Completed Status: `)
    completedStatusLabel.style.fontWeight = "bold"

    const completedStatusText = createUIItem(``, "span", [], completedStatusLabel)
    editText(completedStatusText, `${item.getCompletedStatus}`)
    completedStatusText.style.fontWeight = "normal"
    if (item.getCompletedStatus === "Not Completed") {
        completedStatusText.style.color = "rgb(224, 1, 1)"
    }
    else if (item.getCompletedStatus === "Completed") {
        completedStatusText.style.color = "rgb(0, 132, 0)"
    }


    const descLabel = createUIItem(`detailsWindowText`, "div", [], textContainer)
    editText(descLabel, `Description: `)
    descLabel.style.fontWeight = "bold"

    const descText = createUIItem(``, "span", [], descLabel)
    editText(descText, `${item.getDescription}`)
    descText.style.fontWeight = "normal"

}

function editTask(e, item) {
    addTaskWindow()

    const itemIndex = getId(e.target.parentElement.parentElement).split("-")[3]
    const projectIndex = getId(e.target.parentElement.parentElement).split("-")[1]
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

    for (let option of categoryList.options) {
        if (option.value.split("-")[1] == projectIndex) {
            option.selected = true
            break
        }
    }

    originalAddButton.remove()

    const editButton = createUIItem(`editButton`, "div", ["button"], "")
    editText(editButton, "Edit Task")
    insert(buttonContainer, editButton, 0)

    editButton.addEventListener("click", () => {
        item.changeTitle = inputTaskName.value
        item.changeDescription = inputDesc.value
        item.changeDueDate = inputDueDate.value
        item.changePriority = priorityList.value

        if (categoryList.value != currentPage) {

            // deleting item
            if (["Inbox"].includes(currentPage)) {
                inboxList.splice(itemIndex, 1)
            }
            else if (["Today", "Week"].includes(currentPage)) {
                if (item.originProject === "Inbox") {
                    inboxList.splice(itemIndex, 1)
                }
                else {
                    findProjectThroughProjectName(item.originProject).getItems.splice(itemIndex, 1)
                }
            }
            else {
                projectList[projectIndex].getItems.splice(itemIndex, 1)
            }

            // adding item
            if (categoryList.value === "Inbox") {
                inboxList.push(item)
            }
            else {
                const newProject = findProjectThroughProjectName(categoryList.value.split("-")[2])
                newProject.addItem(item.getTitle, item.getDescription, item.getDueDate, item.getPriority, "Not Completed", newProject.getIndex)
            }
        }

        updateMainScreen()
        window.remove()
        
    })
    
}

function addTaskWindow() {

    const window = createUIItem("window", "dialog", ["addTaskWindow"], select("body"))
    window.showModal()

    createUIItem("exitButton", "div", [], window) // empty so that grid is consistent

    const formContainer = createUIItem("addTaskFormContainer", "form", [], window)

    const titleText = createUIItem("titleText", "div", [], formContainer)
    editText(titleText, "Add Task")

    // task title
    const inputRowContainer = createUIItem("inputRowContainer", "div", [], formContainer)

    const inputTaskLabel = createUIItem("inputTaskLabel", "span", ["label"], inputRowContainer)
    editText(inputTaskLabel, "Task Name:")


    const inputTaskName = createUIItem("inputTaskName", "input", ["input"], inputRowContainer)
    inputTaskName.type = 'text'
    inputTaskName.name = 'taskName'
    inputTaskName.placeholder = 'Task Name'

    // description
    const inputRowContainer2 = createUIItem("inputRowContainer", "div", [], formContainer)

    const inputDescLabel = createUIItem("inputDescLabel", "span", ["label"], inputRowContainer2)
    editText(inputDescLabel, "Task Description:")

    const inputDesc = createUIItem("inputDesc", "textarea", ["textArea", "inputTaskDesc"], inputRowContainer2)
    inputDesc.name = 'taskDesc'
    inputDesc.placeholder = 'Task Description'
    inputDesc.rows ="3"
    inputDesc.cols = "25"

    // due date
    const inputRowContainer3 = createUIItem("inputRowContainer", "div", [], formContainer)

    const inputDueDateLabel = createUIItem("inputDueDateLabel", "span", ["label"], inputRowContainer3)
    editText(inputDueDateLabel, "Task Due Date:")

    const inputDueDate = createUIItem("inputDueDate", "input", ["input"], inputRowContainer3)
    inputDueDate.type = 'date'
    inputDueDate.name = 'taskDueDate'
    inputDueDate.placeholder = 'Due Date'

    // priority dropdown
    const inputPriority = createUIItem("inputPriority", "div", [], formContainer)

    const inputPriorityLabel = createUIItem("inputPriorityLabel", "span", [], inputPriority)
    editText(inputPriorityLabel, "Priority:")

    const priorityList = createUIItem("priorityList", "select", ["list"], inputPriority)
    priorityList.name = "Priority"

    const priorityLevels = ["Low", "Medium", "High"]
    for (let i = 0; i < priorityLevels.length; i++) {
        const priorityLevel = priorityLevels[i]
        const item = createUIItem(priorityLevel, "option", [], priorityList)
        editValue(item, priorityLevel)
        editText(item, priorityLevel)
    }

    // category dropdown
    const inputCategory = createUIItem("inputCategory", "div", [], formContainer)

    const inputCategoryLabel = createUIItem("inputCategoryLabel", "span", [], inputCategory)
    editText(inputCategoryLabel, "Category: ")

    const categoryList = createUIItem("categoryList", "select", ["list"], inputCategory)
    categoryList.name = "Category"

    const inbox = createUIItem("inboxCategory", "option", [], categoryList)
    editValue(inbox, "Inbox")
    editText(inbox, "Inbox")

    projectList.forEach((project) => {
        const choice = createUIItem("choiceCategory", "option", [], categoryList)
        editValue(choice, `projectIndex-${project.getIndex}-${project.getTitle}`)
        editText(choice, `${project.getTitle}`)
    })

    // Add and Cancel Button
    const buttonContainer = createUIItem("buttonContainer", "div", [], formContainer)

    const addButton = createUIItem("addButton", "div", ["button"], buttonContainer)
    editText(addButton, "Add Task")

    addButton.addEventListener("click", function addItem() {

        const name = inputTaskName.value
        const description = inputDesc.value
        const dueDate = inputDueDate.value
        const priority = priorityList.value
        const category = categoryList.value

        const asterisk = create("span")
        editText(asterisk, "*")

        if (name === "") {
    
            // makes sure no more than one asterisk
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

            // makes sure no more than one asterisk
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

    const cancelButton = createUIItem("cancelButton", "div", ["button"], buttonContainer)
    editText(cancelButton, "Cancel")

    cancelButton.addEventListener("click", () => {
        window.remove()
    })
}

function addProjectAddButtonFunctionality() {
    const sideBar = select("#sideBar")

    const inputContainer = createUIItem("projectNavChild", "div", [], sideBar)
    addId(inputContainer, "projectNavInputContainer")

    const nameInput = createUIItem("nameInput", "input", [], inputContainer)
    nameInput.placeholder = "Project Name"

    const iconContainer = createUIItem("iconContainer", "div", [], inputContainer)

    const checkmark = createUIItem("checkmark", "img", [], iconContainer)
    checkmark.src = checkmarkSvg

    checkmark.addEventListener("click", () => {
        if (nameInput.value === "") {
            inputContainer.remove()
            return
        }

        if (nameInput.value.length > 15) {
            alert("Project Name can not be over 15 characters.")
            return
        }

        if (["Inbox", "Today", "Week", "Projects"].includes(nameInput.value)) {
            alert("Project Name can not be a default.")
            return
        }

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].getTitle === nameInput.value) {
                alert("Project Name already exists!")
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

    const xIcon = createUIItem("xIcon", "img", [], iconContainer)
    xIcon.src = exitButtonSvg

    xIcon.addEventListener("click", () => {
        inputContainer.remove()
    })
}

function findProjectThroughProjectName(projectName) {

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

function createUIItem(stringTitle, typeOfElement, arrayOfExtraClasses, appendingParent) {
    const item = create(typeOfElement)

    if (stringTitle != "") {
        addClass(item, stringTitle)
    }

    if (arrayOfExtraClasses.length > 0) {
        for (let i = 0; i < arrayOfExtraClasses.length; i++) {
            addClass(item, arrayOfExtraClasses[i])
        }
    }

    if (appendingParent != "") {
        append(appendingParent, item)
    }

    return item
}

function editProject(e, item) {
    addTaskWindow()
    const window = select(".window")
    const titleText = select(".titleText")
    const inputTaskName = select(".inputTaskName")
    const inputTaskLabel = select(".inputTaskLabel")
    const originalAddButton = select(".addButton")
    const buttonContainer = select(".buttonContainer")

    editText(titleText, "Edit Project Name")
    editText(inputTaskLabel, "Project Name: ")
    inputTaskName.placeholder = "Project Name"
    inputTaskName.value = item.getTitle
    select(".exitButton").remove()

    removeClass(window, "addTaskWindow")
    addClass(window, "editProjectNameWindow")

    const parentsToRemove = [".inputDescLabel", ".inputDueDateLabel", ".inputPriorityLabel", ".inputCategoryLabel"]
    for (let i = 0; i < parentsToRemove.length; i++) {
    select(parentsToRemove[i]).parentElement.remove()
    }

    originalAddButton.remove()

    const editButton = createUIItem(`editButton`, "div", ["button"], "")
    editText(editButton, "Edit Name")
    insert(buttonContainer, editButton, 0)

    editButton.addEventListener("click", () => {
        const newName = inputTaskName.value

        if (newName === item.getTitle) {
            window.remove()
            updateMainScreen()
            return
        }
    
        if (newName.length > 15) {
            alert("Project Name can not be over 15 characters.")
            return
        }

        if (newName.length === 0) {
            alert("Project Name can not be empty.")
            return
        }

        if (["Inbox", "Today", "Week", "Projects"].includes(newName)) {
            alert("Project Name can not be a default.")
            return
        }

        for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].getTitle === newName) {
                alert("Project Name already exists!")
                return
            }
        }

        item.changeTitle = newName
        window.remove()
        updateMainScreen()
    })

}