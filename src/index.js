import "./styles.css";
import { initialize, updateSideBar, updateMainScreen } from "./dom.js"

export const inboxList = []
export const todayTasksList = []
export const weekTasksList = []
export const projectList = []

class Item {
    constructor(title, description, dueDate, priority, completedStatus, index) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.completedStatus = completedStatus
        this.index = index
        this.toggleCompleteStatus = function() {
            this.completedStatus = this.completedStatus === "Completed" ? "Not Completed" : "Completed"
        }
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

    get getPriority() {
        return this.priority
    }

    get getCompletedStatus() {
        return this.completedStatus
    }

    get getIndex() {
        return this.index
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

    addItem(title, description, dueDate, priority, completedStatus, listNumber) {
        let item = new Item(title, description, dueDate, priority, completedStatus, getProjectItemListLength(listNumber))
        this.itemList.push(item)
    }
}

export function addItemToInbox(title, description, dueDate, priority, completedStatus) {
    const item = new Item(title, description, dueDate, priority, completedStatus, getInboxListLength())
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

addProjectToProjectList("Homework")
projectList[0].addItem("Math", "Chapter 3 Module 4", "May 2024", "High", "Not Completed", 0)
projectList[0].addItem("English", "1984 Chapter 13", "Apr 2024", "High", "Not Completed", 0)
addProjectToProjectList("Tests")
projectList[1].addItem("Science Test", "Cell Anatomy", "Sep 2024", "High", "Not Completed", 1)
projectList[1].addItem("Statistics Final", "Chapter 1 - 10", "May 2024", "High", "Not Completed", 1)

addItemToInbox("Laundry", "fold clothes", "Jun 2023", "Low", "Not Completed")
addItemToInbox("Cook", "Lasagna", "May 2023", "Medium", "Completed")

initialize()
updateMainScreen(inboxList, "Inbox")