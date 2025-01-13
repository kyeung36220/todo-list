import "./styles.css";
import { initialize, updateSideBar, updateMainScreen } from "./dom.js"
import { isToday, isThisWeek, startOfToday, toDate, parseISO, format } from "date-fns";

export let inboxList = []
export let todayTasksList = []
export let weekTasksList = []
export let projectList = []

class Item {
    constructor(title, description, dueDate, priority, completedStatus, index, originProject) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.completedStatus = completedStatus
        this.index = index
        this.toggleCompleteStatus = function() {
            this.completedStatus = this.completedStatus === "Completed" ? "Not Completed" : "Completed"
            updateLocalStorage()
        }
        this.originProject = originProject
    }

    get getTitle() {
        return this.title
    }

    get getDescription() {
        return this.description
    }

    get getDueDate() {
        return this.dueDate
    }

    get UIDueDate() {
        return format(parseISO(this.dueDate), "MM/dd/yyyy")
    }

    get getPriority() {
        return this.priority
    }

    get getCompletedStatus() {
        return this.completedStatus
    }

    get getIndex() {
        return this.index
    }

    get getOriginProject() {
        return this.originProject
    }

    set changeTitle(newTitle) {
        this.title = newTitle
    }

    set changeDescription(newDescription) {
        this.description = newDescription
    }

    set changeDueDate(newDueDate) {
        this.dueDate = newDueDate
    }

    set changePriority(newPriority) {
        this.priority = newPriority
    }
}

class Project {
    constructor(title, index) {
        this.title = title
        this.itemList = []
        this.index = index
    }

    get getTitle() {
        return this.title
    }

    get getItems() {
        return this.itemList
    }

    get getIndex() {
        return this.index
    }

    addItem(title, description, dueDate, priority, completedStatus, listIndex) {
        let originProject = this.title
        let item = new Item(title, description, dueDate, priority, completedStatus, getProjectItemListLength(listIndex), originProject)
        this.itemList.push(item)
    }
}

export function addItemToInbox(title, description, dueDate, priority, completedStatus) {
    const item = new Item(title, description, dueDate, priority, completedStatus, getInboxListLength(), "Inbox")
    inboxList.push(item)
}

function getInboxListLength() {
    return inboxList.length
}

export function addProjectToProjectList(title) {
    const project = new Project(title, getProjectListLength())
    projectList.push(project)
}

function getProjectListLength() {
    return projectList.length
}

function getProjectItemListLength(index) {
    return projectList[index].getItems.length
}

export function updateTodayAndWeekLists() {
    while (todayTasksList.length > 0) {
        todayTasksList.pop()
    }

    while (weekTasksList.length > 0) {
        weekTasksList.pop()
    }

    for (let i = 0; i < inboxList.length; i++) {
        const item = inboxList[i]
        const dueDate = format(parseISO(item.getDueDate), "MM/dd/yyyy")

        if (isToday(dueDate)) {
            todayTasksList.push(item)
        }
        if (isThisWeek(dueDate)) {
            weekTasksList.push(item)
        }
    }

    for (let i = 0; i < projectList.length; i++) {
        for(let j = 0; j < projectList[i].getItems.length; j++) {
            const item = projectList[i].getItems[j]
            const dueDate = format(parseISO(item.getDueDate), "MM/dd/yyyy")
            if (isToday(dueDate)) {
                todayTasksList.push(item)
            }
            if (isThisWeek(dueDate)) {
                weekTasksList.push(item)
            }
        }
    }
}

function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }

function addInitialTasks() {
    if (storageAvailable("localStorage") && localStorage.length > 0) {
        let storageInboxList = JSON.parse(localStorage.getItem("inboxList"))
        let storageProjectList = JSON.parse(localStorage.getItem("projectList"))
    
        for (let i = 0; i < storageInboxList.length; i++) {
            const storageItem = storageInboxList[i]
            const item = new Item(storageItem.title, storageItem.description, storageItem.dueDate, storageItem.priority, storageItem.completedStatus, storageItem.index, "Inbox")
            inboxList.push(item)
        }

        for (let i = 0; i < storageProjectList.length; i++) {
            const storageProject = storageProjectList[i]
            const project = new Project(storageProject.title, storageProject.index)
            projectList.push(project)
            
            for (let j = 0; j < storageProject.itemList.length; j++) {
                const storageItem = storageProject.itemList[j]
                project.addItem(storageItem.title, storageItem.description, storageItem.dueDate, storageItem.priority, storageItem.completedStatus, storageProject.index)
            }
        }

        return
    }
    addProjectToProjectList("Homework")
    projectList[0].addItem("Math", "Chapter 3 Module 4", "2025-01-12", "High", "Not Completed", 0)
    projectList[0].addItem("English", "1984 Chapter 13", "2024-04-15", "High", "Not Completed", 0)
    addProjectToProjectList("Tests")
    projectList[1].addItem("Science Test", "Cell Anatomy", "2024-09-16", "High", "Not Completed", 1)
    projectList[1].addItem("Statistics Final", "Chapter 1 - 10", "2024-05-30", "High", "Not Completed", 1)
    addItemToInbox("Laundry", "fold clothes", "2023-06-17", "Low", "Not Completed")
    addItemToInbox("Cook", "Lasagna", "2023-05-03", "Medium", "Completed")
}

export function updateLocalStorage() {
    if (storageAvailable("localStorage")) {
        localStorage.removeItem("inboxList")
        localStorage.removeItem("projectList")

        localStorage.setItem("inboxList", JSON.stringify(inboxList))
        localStorage.setItem("projectList", JSON.stringify(projectList))
    }
}

addInitialTasks()
initialize()
updateMainScreen()