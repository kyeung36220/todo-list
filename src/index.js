import "./styles.css";

class Item {
    constructor(title, description, dueDate, priority, notes, completed) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.notes = notes
        this.completed = completed
        this.toggleCompleteStatus = function() {
            this.completed = this.completed === "Completed" ? "Not Completed" : "Completed"
        }
    }
}