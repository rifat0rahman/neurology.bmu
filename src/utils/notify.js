import { reactive } from "vue"

export const notifications = reactive([])

let id = 0

function create(type, message, position = "top") {
    const item = {
        id: id++,
        type,
        message,
        position
    }

    notifications.push(item)

    setTimeout(() => {
        remove(item.id)
    }, 3000)
}

function remove(id) {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) notifications.splice(index, 1)
}

export const Notify = {
    success(msg, pos = "top") {
        create("success", msg, pos)
    },
    error(msg, pos = "top") {
        create("error", msg, pos)
    },
    info(msg, pos = "top") {
        create("info", msg, pos)
    }
}