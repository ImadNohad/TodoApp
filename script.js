
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
            "title": "Complete online Javascript course",
            "completed": false
        },
        {
            "title": "Jog around the park 3x",
            "completed": false
        },
        {
            "title": "10 minutes meditation",
            "completed": false
        },
        {
            "title": "Read for 1 hour",
            "completed": false
        },
        {
            "title": "Pick up groceries",
            "completed": false
        },
        {
            "title": "Complete TodoApp on Frontend Mentor",
            "completed": false
        }
    ]

    const tasklist = document.querySelector('.tasklist');
    let tasks = localStorage.getItem("tasks") !== null ? JSON.parse(localStorage.getItem("tasks")) : data
    let filteredTasks = tasks

    console.log(tasks);

    loadTasks(tasks)

    updateCount()

    tasklist.addEventListener('click', (e) => {
        const index = e.target.parentElement.getAttribute("data-index")
        if (e.target.classList.contains('cbComplete')) {
            e.target.toggleAttribute("checked")
            let checked = e.target.getAttribute("checked") !== null
            e.target.parentElement.classList.toggle("completed")
            tasks[index].completed = checked
            updateCount()
        }
        if (e.target.classList.contains('remove')) {
            tasks.splice(index, 1)
            e.target.parentElement.remove()
            updateCount()
        }
        saveTasks()
    });

    document.querySelector(".filter").addEventListener('click', (e) => {
        if (e.target.classList.contains('clearCompleted')) {
            e.preventDefault()
            clearCompledted()
        }
        if (e.target.classList.contains('option')) {
            e.preventDefault()
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

    const newTask = document.querySelector("#txtNew")
    newTask.addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            addNewTask(event.target.value)
            event.target.value = ""
        }
    })

    function loadTasks(tasks) {
        tasklist.innerHTML = ""
        tasks.forEach((element, index) => {
            populateTask(element, index)
        });
    }

    function populateTask(task, index) {
        let taskDiv = document.createElement("div")
        taskDiv.className = `task${task.completed ? " completed" : ""}`
        taskDiv.setAttribute("draggable", "true")
        taskDiv.setAttribute("data-index", index)
        let cbTask = document.createElement("input")
        cbTask.type = "checkbox"
        cbTask.className = "cbComplete"
        if (task.completed) cbTask.setAttribute("checked", "")
        taskDiv.appendChild(cbTask)
        taskDiv.innerHTML += `<p class="taskText">${task.title}</p><img class="remove" src="images/icon-cross.svg" alt="">`
        console.log(taskDiv);
        tasklist.appendChild(taskDiv)
    }

    function addNewTask(taskText) {
        let newTask = { title: taskText, completed: false }
        tasks.push(newTask)
        populateTask(newTask, tasks.indexOf(newTask))
        updateCount()
        saveTasks()
    }

    function clearCompledted() {
        const completed = tasklist.querySelectorAll(".completed")
        Array.from(completed).forEach(element => {
            element.remove()
        });
        tasks = tasks.filter((e) => !e.completed)
        updateCount()
        saveTasks()
    }

    function filterTasks(category) {
        if (category == "active") {
            filteredTasks = tasks.filter(e => !e.completed)
        }

        if (category == "all") {
            filteredTasks = tasks
        }

        if (category == "completed") {
            filteredTasks = tasks.filter(e => e.completed)
        }

        console.log(filteredTasks);
        loadTasks(filteredTasks)
    }

    function updateCount() {
        const taskCount = document.querySelector(".itemsLeft")
        taskCount.textContent = tasks.filter(e => !e.completed).length
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    document.querySelector("header img").addEventListener("click", function () {
        let dark = document.body.classList.contains("dark")
        document.body.classList.toggle("dark")
        this.src = dark ? "images/icon-moon.svg" : "images/icon-sun.svg"
    })
})
