
let taskInput = document.querySelector(".task-input-label");
let tasksUl = document.querySelector(".tasks");
let spanOfItems = document.querySelector(".items-count");
let clearBtn = document.querySelector(".clear");
let filters = document.querySelectorAll(".filters li");


let arrayOfObject = JSON.parse(window.localStorage.getItem("task")) || [];
addToPage("all");
checkItemsLeft();
sortList();
ifCheckBoxChecked();



taskInput.addEventListener("keyup", (e) => {
    let inputValue = taskInput.value;
    if (e.key === "Enter" && inputValue !== "") {
        
        let task = {
            title: inputValue,
            status: "pending",
        };
        
        arrayOfObject.push(task);
       
        saveToLocalStorage(arrayOfObject);

        taskInput.value = "";

       
        addToPage("all");
    }
});


function saveToLocalStorage(arr) {
    window.localStorage.setItem("task", JSON.stringify(arr));
}


function addToPage(filter) {
    
    document.querySelectorAll(".task-container").forEach((ele) => ele.remove());
    
    arrayOfObject.forEach((task, index) => {
        
        let ifCompeleted = task.status === "completed" ? "checked" : "";

       
        if (filter === task.status || filter === "all") {
            
            let taskContainer = document.createElement("div");
            taskContainer.className = "task-container";
            taskContainer.setAttribute("draggable", true);
            taskContainer.innerHTML = `<label for="${index}">
                    <div class="mark ${ifCompeleted}">
                        <i class="fa-solid fa-check check"></i>
                    </div>
                    <input onclick="updateTasks(this)" type="checkbox" id="${index}" ${ifCompeleted}>
                    <li class="task ${ifCompeleted}" id="task">${task.title}</li>
                </label>
                <i onclick="deleteTask(${index})" class="fa-solid fa-trash-can del"></i>`;
            tasksUl.appendChild(taskContainer);
            checkItemsLeft();
            sortList();
            ifCheckBoxChecked()
        }
    });
}


function updateTasks(checkBox) {
   
    let ourTask = checkBox.nextElementSibling;
    let checkedIcon = checkBox.previousElementSibling.querySelector(".check");
    let mark = checkBox.previousElementSibling;
    
    if (checkBox.checked) {
        ourTask.classList.add("checked");
        checkedIcon.classList.add("active");
        mark.classList.add("active");
      
        arrayOfObject[checkBox.id].status = "completed";
    } else {
        ourTask.classList.remove("checked");
        checkedIcon.classList.remove("active");
        mark.classList.remove("active");
        
        arrayOfObject[checkBox.id].status = "pending";
    }
    saveToLocalStorage(arrayOfObject);
    checkItemsLeft();
}


function deleteTask(delBtnIndex) {
   
    arrayOfObject.splice(delBtnIndex, 1);
    
    saveToLocalStorage(arrayOfObject);
    addToPage("all");
    checkItemsLeft();
    ifCheckBoxChecked()
}


clearBtn.addEventListener("click", () => {
    
    let filtered = arrayOfObject.filter((ele) => {
        return ele.status === "pending";
    });
    
    arrayOfObject = filtered;
   
    saveToLocalStorage(arrayOfObject);
    addToPage("all");
});


filters.forEach((filter) => {
    filter.addEventListener("click", () => {
        filters.forEach((ft) => {
            ft.classList.remove("active");
        });
        filter.classList.add("active");
        addToPage(filter.id);
    });
});


let modes = document.querySelectorAll(".themes svg");
let moon = document.querySelector(".moon");
let sun = document.querySelector(".sun");
modes.forEach((mode) => {
    mode.addEventListener("click", () => {
        document.body.classList.toggle("light");
        if (document.body.classList.contains("light")) {
            document.querySelector("header img").src = "images/bg-desktop-light.jpg";
            sun.classList.remove("active");
            moon.classList.add("active");
        } else {
            document.querySelector("header img").src = "images/bg-desktop-dark.jpg";
            moon.classList.remove("active");
            sun.classList.add("active");
        }
    });
});



let draggedElement;

function sortList() {
    let taskToDrag = document.querySelectorAll(".task-container");
    taskToDrag.forEach((ele) => {
        ele.addEventListener("dragstart", () => {
            draggedElement = ele;
            taskToDrag.forEach((tsk) => {
                if (tsk !== draggedElement) {
                    tsk.classList.add("dragging");
                }
            });
        });
        ele.addEventListener("dragenter", () => {
            if (ele !== draggedElement) {
                ele.classList.add("active");
            }
        });
        ele.addEventListener("dragleave", () => {
            if (ele !== draggedElement) {
                ele.classList.remove("active");
            }
        });
        ele.addEventListener("dragend", () => {
            taskToDrag.forEach((tsk) => {
                tsk.classList.remove("dragging");
                tsk.classList.remove("active");
            });
        });
        ele.addEventListener("dragover", (e) => {
            e.preventDefault();
        });
        ele.addEventListener("drop", (e) => {
            e.preventDefault();
            if (ele !== draggedElement) {
                let dragElements = document.querySelectorAll(".task-container");
                let draggedPos, droppedPos;
                for (let i = 0; i < dragElements.length; i++) {
                    if (draggedElement === dragElements[i]) {
                        
                        draggedPos = i;
                        console.log(i);
                    }
                    if (ele === dragElements[i]) {
                       
                        droppedPos = i;
                        console.log(i);
                    }
                }
                if (draggedPos < droppedPos) {
                    ele.parentNode.insertBefore(draggedElement, ele.nextSibling);
                } else {
                    ele.parentNode.insertBefore(draggedElement, ele);
                }
            }
        });
    });
}


function checkItemsLeft() {
    let itemLeft = arrayOfObject.filter((ele) => {
        return ele.status === "pending";
    });

    if (itemLeft.length === 0) {
        spanOfItems.innerText = "0";
    } else {
        spanOfItems.innerText = itemLeft.length;
    }
}


function ifCheckBoxChecked() {
    let marksConatiner = document.querySelectorAll(".mark");
    marksConatiner.forEach((container) => {
        if (container.classList.contains("checked")) {
            container.classList.add("active");
            let checkMark = container.querySelector(".check");
            checkMark.classList.add("active");
        }
    });
}
