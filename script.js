
// const dragList = document.querySelector('.taskList');
// let draggedItem = null;

// dragList.addEventListener('dragstart', handleDragStart);
// dragList.addEventListener('dragover', handleDragOver);
// dragList.addEventListener('drop', handleDrop);

// function handleDragStart(event) {
//     draggedItem = event.target;
//     event.dataTransfer.effectAllowed = 'move';
//     event.dataTransfer.setData('text/html', draggedItem.innerHTML);
//     event.target.style.opacity = '0.5';
// }

// function handleDragOver(event) {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//     const targetItem = event.target;
//       if (targetItem !== draggedItem && targetItem.classList.contains('task')) {
//         draggedItem.style.top -= event.clientY
//       }
// }

// function handleDrop(event) {
//     event.preventDefault();
//     const targetItem = event.target;
//     if (targetItem !== draggedItem && targetItem.classList.contains('task')) {
//         if (event.clientY > targetItem.getBoundingClientRect().top + (targetItem.offsetHeight / 2)) {
//             targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling);
//         } else {
//             targetItem.parentNode.insertBefore(draggedItem, targetItem);
//         }
//     }
//     draggedItem.style.opacity = '';
//     draggedItem = null;
// }

document.addEventListener("DOMContentLoaded", function (event) {

    const data = [
        {
            id: 1,
            "title": "Complete online Javascript course",
            "completed": false
        },
        {
            id: 2,
            "title": "Jog around the park 3x",
            "completed": false
        },
        {
            id: 3,
            "title": "10 minutes meditation",
            "completed": false
        },
        {
            id: 4,
            "title": "Read for 1 hour",
            "completed": false
        },
        {
            id: 5,
            "title": "Pick up groceries",
            "completed": false
        },
        {
            id: 6,
            "title": "Complete TodoApp on Frontend Mentor",
            "completed": false
        }
    ]

    const tasklist = document.querySelector('.tasklist');
    let tasks = localStorage.getItem("tasks") !== null ? JSON.parse(localStorage.getItem("tasks")) : data
    let category = localStorage.getItem("category") !== null ? localStorage.getItem("category") : "all"
    let filteredTasks = tasks

    filterTasks(category)
    updateCount()

    tasklist.addEventListener('click', (e) => {
        const id = e.target.parentElement.getAttribute("data-id")
        if (e.target.classList.contains('cbComplete')) {
            e.target.toggleAttribute("checked")
            let checked = e.target.getAttribute("checked") !== null
            e.target.parentElement.classList.toggle("completed")
            const item = tasks.find(obj => obj.id == id);
            item.completed = checked
            category = localStorage.getItem("category")
            filterTasks(category)
            showToast(`Task marked as ${checked ? "Completed" : "Active" }.`)
            updateCount()
        }
        if (e.target.classList.contains('remove')) {
            tasks = tasks.filter(e => e.id != id)
            e.target.parentElement.remove()
            showToast()
            updateCount()
        }
        saveTasks()
    });

    [document.querySelector(".filter"), document.querySelector(".filter-mobile")].forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault()
            if (e.target.classList.contains('clearCompleted')) {
                clearCompledted()
            }
            if (e.target.classList.contains('option')) {
                let options = this.querySelectorAll(".option")
                Array.from(options).forEach(element => {
                    element.classList.remove("selected")
                });
                let option = e.target.textContent.toLowerCase()
                e.target.classList.add("selected")
                filterTasks(option)
                updateCount()
            }
        });
    });

    const newTask = document.querySelector("#txtNew")
    newTask.addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            addNewTask(event.target)
        }
    })

    function loadTasks(tasks) {
        let noTasks = document.querySelector(".notasks")
        noTasks.style.display = tasks.length == 0 ? "block" : "none"
        tasklist.innerHTML = ""
        tasks.forEach((element) => {
            populateTask(element)
        });
    }

    function populateTask(task) {
        console.log(task);
        let taskDiv = document.createElement("div")
        taskDiv.className = `task${task.completed ? " completed" : ""}`
        taskDiv.setAttribute("draggable", "true")
        taskDiv.setAttribute("data-id", task.id)
        let cbTask = document.createElement("input")
        cbTask.type = "checkbox"
        cbTask.className = "cbComplete"
        if (task.completed) cbTask.setAttribute("checked", "")
        taskDiv.appendChild(cbTask)
        taskDiv.innerHTML += `<p class="taskText">${task.title}</p><img class="remove" src="images/icon-cross.svg" alt="">`
        console.log(taskDiv);
        tasklist.appendChild(taskDiv)
    }

    function addNewTask(input) {
        let newId = Math.max(...tasks.map(e => e.id)) + 1
        let newTask = { id: newId, title: input.value, completed: false }
        tasks.push(newTask)
        updateCount()
        saveTasks()
        category = localStorage.getItem("category")
        filterTasks(category)
        showToast("Task added successfully.")
        input.value = ""
    }

    function clearCompledted() {
        const completed = tasklist.querySelectorAll(".completed")
        Array.from(completed).forEach(element => {
            element.remove()
        });
        tasks = tasks.filter((e) => !e.completed)
        updateCount()
        saveTasks()
        showToast("Completed tasks cleared successfully.")
    }

    function filterTasks(category) {
        if (category == "active") {
            localStorage.setItem("category", "active")
            filteredTasks = tasks.filter(e => !e.completed)
        }

        if (category == "all") {
            localStorage.setItem("category", "all")
            filteredTasks = tasks
        }

        if (category == "completed") {
            localStorage.setItem("category", "completed")
            filteredTasks = tasks.filter(e => e.completed)
        }

        loadTasks(filteredTasks)
    }

    function updateCount() {
        const taskCount = document.querySelector(".itemsLeft")
        taskCount.textContent = tasks.filter(e => !e.completed).length
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    //Dark Mode / Light Mode Toggle
    document.querySelector("header img").addEventListener("click", function () {
        let dark = document.body.classList.contains("dark")
        document.body.classList.toggle("dark")
        this.src = dark ? "images/icon-moon.svg" : "images/icon-sun.svg"
    })

    // Toast 
    const toast = document.getElementById("toast");
    let toastTimeout;
    function showToast(message = "Task removed successfully.") {
        const toastMessage = document.getElementById("toast-message");
        toastMessage.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(hideToast, 2000);
    }

    const toastClose = document.getElementById("toast-close");
    toastClose.addEventListener("click", hideToast)
    function hideToast() {
        toast.classList.remove("show");
    }
})

