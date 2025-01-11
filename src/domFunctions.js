export function select(item) {
    return document.querySelector(item)
}

export function create(item) {
    return document.createElement(item)
}

export function editText(item, text) {
    item.textContent = text
}

export function addClass(item, className) {
    item.classList.add(className)
}

export function append(parent, child) {
    parent.appendChild(child)
}

export function capitalize(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function insert(parent, item, beforeWhatIndex) {
    parent.insertBefore(item, parent.children[beforeWhatIndex])
}

export function addId(item, idName) {
    item.id = idName
}