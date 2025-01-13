import "./styles.css";
import { initialize, updateSideBar, updateMainScreen } from "./dom.js"
import { isToday, isThisWeek, startOfToday, toDate, parseISO, format } from "date-fns";

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
        let item = new Item(title, description, dueDate, priority, completedStatus, getProjectItemListLength(listIndex))
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

addProjectToProjectList("Homework")
projectList[0].addItem("Math", "Chapter 3 Module 4", "2025-01-12", "High", "Not Completed", 0)
projectList[0].addItem("English", "1984 Chapter 13", "2024-04-15", "High", "Not Completed", 0)
addProjectToProjectList("Tests")
projectList[1].addItem("Science Test", "Cell Anatomy", "2024-09-16", "High", "Not Completed", 1)
projectList[1].addItem("Statistics Final", "Chapter 1 - 10", "2024-05-30", "High", "Not Completed", 1)

addItemToInbox("Laundry", "fold clothes", "2023-06-17", "Low", "Not Completed")
addItemToInbox("Cook", "Lasagna", "2023-05-03", "Medium", "Completed")

initialize()
updateMainScreen(inboxList, "Inbox")
console.log(startOfToday())