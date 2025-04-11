document.addEventListener("DOMContentLoaded", function (event) {
    //Données initiales
    const data = [
        {
            id: 1,
            "title": "Complete online Javascript course",
            "completed": false,
            order: 1
        },
        {
            id: 2,
            "title": "Jog around the park 3x",
            "completed": false,
            order: 2
        },
        {
            id: 3,
            "title": "10 minutes meditation",
            "completed": false,
            order: 3
        },
        {
            id: 4,
            "title": "Read for 1 hour",
            "completed": false,
            order: 4
        },
        {
            id: 5,
            "title": "Pick up groceries",
            "completed": false,
            order: 5
        },
        {
            id: 6,
            "title": "Complete TodoApp on Frontend Mentor",
            "completed": false,
            order: 6
        }
    ]

    //Liste des tâches
    const tasklist = document.querySelector('.tasklist');

    //Récupération des tâches depuis localStorage si non null, sinon depuis le tableau data
    let tasks = localStorage.getItem("tasks") !== null ? JSON.parse(localStorage.getItem("tasks")) : data

    //Récupération de la catégorie du filtre depuis localStorage si non null, sinon "all" est appliqué
    let category = localStorage.getItem("category") !== null ? localStorage.getItem("category") : "all"
    let filteredTasks = tasks

    //filtrage des tâches selon la catégorie
    filterTasks(category)

    //Mise à jour du compteur des tâches
    updateCount()

    //Ecoute de l'événement click sur toute la liste des tâches (Event Délégation)
    tasklist.addEventListener('click', (e) => {

        //Click sur le checkbox Complete
        const id = e.target.parentElement.getAttribute("data-id")
        if (e.target.classList.contains('cbComplete')) {
            e.target.toggleAttribute("checked")
            let checked = e.target.getAttribute("checked") !== null
            e.target.parentElement.classList.toggle("completed")
            const item = tasks.find(obj => obj.id == id);
            item.completed = checked
            category = localStorage.getItem("category")
            filterTasks(category)
            showToast(`Task marked as ${checked ? "Completed" : "Active"}.`)
            updateCount()
        }

        //Click sur le bouton Remove
        if (e.target.classList.contains('remove')) {
            tasks = tasks.filter(e => e.id != id)
            e.target.parentElement.remove()
            showToast()
            updateCount()
        }

        //Sauvegarde des tâches du tableau dans localStorage
        saveTasks()
    }, true);

    let filters = [document.querySelector(".filter"), document.querySelector(".filter-mobile")]

    //Application du filtre
    filters.forEach(element => {
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

    //Ajouter une nouvelle tâche
    const newTask = document.querySelector("#txtNew")
    newTask.addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
            addNewTask(event.target)
        }
    })

    //Affichage et ordre des tâches
    function loadTasks(tasks) {
        let noTasks = document.querySelector(".notasks")
        noTasks.style.display = tasks.length == 0 ? "block" : "none"
        tasklist.innerHTML = ""
        tasks.sort((a, b) => a.order - b.order)
        tasks.forEach((element) => {
            populateTask(element)
        });
    }

    //Affichage d'une tâche individuelle
    function populateTask(task) {
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
        tasklist.appendChild(taskDiv)
        taskDiv.addEventListener("dragstart", dragAndDrop)
    }

    //Fonction d'Ajout d'une nouvelle tâche
    function addNewTask(input) {
        let newId = Math.max(...tasks.map(e => e.id)) + 1
        let order = Math.max(...tasks.map(e => e.order)) + 1
        let newTask = { id: newId, title: input.value, completed: false, order: order }
        tasks.push(newTask)
        updateCount()
        saveTasks()
        category = localStorage.getItem("category")
        filterTasks(category)
        showToast("Task added successfully.")
        input.value = ""
    }

    //Suppresion des tâches marquées comme complete
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

    //Filtrage des tâches par catégorie
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

    function dragAndDrop(event) {
        let originalItem = event.target;

        const clone = originalItem.cloneNode(true);
        clone.classList.add('dragging');
        document.body.appendChild(clone);

        const rect = originalItem.getBoundingClientRect();
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;

        const placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.style.height = `${rect.height}px`;
        originalItem.parentNode.insertBefore(placeholder, originalItem);
        originalItem.style.display = 'none';

        const offsetX = event.clientX - clone.getBoundingClientRect().left;
        const offsetY = event.clientY - clone.getBoundingClientRect().top;

        const onMouseMove = (e) => {
            clone.style.top = `${e.clientY - offsetY}px`;
            clone.style.left = `${e.clientX - offsetX}px`;

            const items = Array.from(tasklist.children).filter(
                (child) => child !== clone && child !== placeholder
            );

            let newPlaceholderIndex = items.length;
            for (let i = 0; i < items.length; i++) {
                const itemRect = items[i].getBoundingClientRect();
                if (e.clientY < itemRect.top + itemRect.height / 2) {
                    newPlaceholderIndex = i;
                    break;
                }
            }

            tasklist.insertBefore(placeholder, items[newPlaceholderIndex]);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            tasklist.replaceChild(originalItem, placeholder);
            originalItem.style.display = '';
            document.body.removeChild(clone);

            Array.from(tasklist.children).forEach((task, index) => {
                tasks.forEach(element => {
                    let taskId = Number(task.getAttribute("data-id"))
                    if (element.id == taskId) {
                        element.order = index + 1
                        return
                    }
                });
            })

            saveTasks()
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
})