let todoItemsContainer = document.getElementById("todoItemsContainer");
let onAddTodoButton = document.getElementById("onAddTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

//when we reload or refresh the application whatever we created need to persist for that we created a function here called getTodoListFromLocalstorage
function getTodoListFromLocalstorage() { //getting key and values pairs from localstoage and converting it into js by using parse
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);

    if (parsedTodoList === null) { //sometimes parsedTodoList will be empty then it will return null else it will return parsedTodoList
        return [];
    } else {
        return parsedTodoList;
    }
}
let todoList = getTodoListFromLocalstorage()
//here when we check in developer tool when the user adding new list it will not showing in localStorage and when reloading it is desepiring 
// to fix this when the user adding the new elements we need to make changes in onAddTodo
let todoCount = todoList.length;


saveTodoButton.onclick = function() { //when we click save btn in inspect developer tools it will show the converted key and value pairs into string
    localStorage.setItem("todoList", JSON.stringify(todoList)); //todolist is a array here we are converting it into stringify   //conveting key and values into json stringify

}

function checkboxTextStrickOff(checkboxId, labelId, todoId) {
    let checkboxIdEl = document.getElementById(checkboxId);
    let labelIdEl = document.getElementById(labelId);
    labelIdEl.classList.toggle("checked-status");

    let todoObjectIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }

    });
    let todoObject = todoList[todoObjectIndex]
    if (todoObject.isChecked === true) {
        todoObject.isChecked = false
    } else {
        todoObject.isChecked = true;
    }
    /*if(checkboxIdEl.checked === true){
        labelIdEl.classList.add("checked-status");
    }else{
        labelIdEl.classList.remove("checked-status");
    }*/

}

function onDeleteTodoItem(todoId) { //when we click the delete button the item need to get deleted even from localStorage and when we reload the application that item should not need to persist in localStorage
    let todoIdEl = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoIdEl);
    //console.log(todoList)
    let deleteIndex = todoList.findIndex(function(eachtodo) { //need to find the index which we want to delete 
        let eachTodoId = "todo" + eachtodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true
        } else {
            return false
        }


    });
    todoList.splice(deleteIndex, 1);

}
//console.log(todoList)

function onEditTodoItem(todoId) {
    let todoElement = document.getElementById(todoId);
    let labelElement = todoElement.querySelector(".checkbox-label");

    // Prompt the user for new text
    let newText = prompt("Edit your task:", labelElement.textContent);
    if (newText === null || newText.trim() === "") {
        return; // If canceled or empty, do nothing
    }
    

    labelElement.textContent = newText;

    // Update the todoList array and localStorage
    let todoIndex = todoList.findIndex(function(eachTodo) {
        return "todo" + eachTodo.uniqueNo === todoId;
    });
    if (todoIndex !== -1) {
        todoList[todoIndex].text = newText;
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;


    let todoElement = document.createElement("li");
    todoElement.id = todoId;
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.classList.add("checkbox-input");
    inputElement.id = checkboxId;

    inputElement.checked = todo.isChecked;
    inputElement.onclick = function() {
        checkboxTextStrickOff(checkboxId, labelId, todoId)
    }

    inputElement.type = "checkbox";
    todoElement.appendChild(inputElement);


    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    labelElement.id = labelId;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked-status")
    }
    labelElement.setAttribute("for", checkboxId);
    labelContainer.appendChild(labelElement);

    let deletecontainer = document.createElement("div");
    deletecontainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deletecontainer);

    let editElement = document.createElement("button");
    editElement.textContent = "Edit";
    editElement.classList.add("edit-icon");
    editElement.onclick = function() {
        onEditTodoItem(todoId);
    }
    deletecontainer.appendChild(editElement);

    let deleteElement = document.createElement("i");
    deleteElement.onclick = function() {
        onDeleteTodoItem(todoId)
    }
    deleteElement.classList.add("delete-icon", "fas", "fa-times");
    deletecontainer.appendChild(deleteElement);


}

function onAddTodo() {
    let userTodoInput = document.getElementById("userTodoInput");
    let userInputValue = userTodoInput.value;





    if (userInputValue === "") {
        alert("Enter Your Task");
        return;
    }

    todoCount = todoCount + 1;
    let newTodo = {
        text: userInputValue,
        uniqueNo: todoCount,
        isChecked: false //for checkbox to check the checked status we provide isChecked : false and we use removeItem() 
    }
    createAndAppendTodo(newTodo); //we dynamically adding newTodo into createAndAppendTodo
    todoList.push(newTodo) //here by using push method we have to append user inputs into todolist then only it is visible in the localStorage also
    userTodoInput.value = ""

}

let userTodoInput = document.getElementById("userTodoInput");

userTodoInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        onAddTodo(); // Calls the function to add the item to the list
    }
});

onAddTodoButton.onclick = function() {
    onAddTodo()
}

for (let todo of todoList) {
    createAndAppendTodo(todo)
}

let clearAllButton = document.getElementById("clearAllButton");

clearAllButton.onclick = function() {
    // Clear all todos from the DOM
    todoItemsContainer.innerHTML = "";

    // Clear the todoList array
    todoList = [];

    // Clear the todoList from localStorage
    localStorage.setItem("todoList", JSON.stringify(todoList));
};



/*

<button id="saveTodoButton" style="display:none;">Save</button>
<button id="clearAllButton" style="display:none;">Clear All</button>


// Function to toggle the visibility of buttons based on the todo list
function toggleButtonsVisibility() {
    if (todoList.length > 0) {
        saveTodoButton.style.display = "inline-block";  // Show the save button
        clearAllButton.style.display = "inline-block"; // Show the clear all button
    } else {
        saveTodoButton.style.display = "none";  // Hide the save button
        clearAllButton.style.display = "none"; // Hide the clear all button
    }
}

// Function to add a new todo
function onAddTodo() {
    let userTodoInput = document.getElementById("userTodoInput");
    let userInputValue = userTodoInput.value;

    if (userInputValue === "") {
        alert("Enter Your Task");
        return;
    }

    todoCount = todoCount + 1;
    let newTodo = {
        text: userInputValue,
        uniqueNo: todoCount,
        isChecked: false
    }
    createAndAppendTodo(newTodo);
    todoList.push(newTodo);  // Add the new todo to the list
    userTodoInput.value = "";

    toggleButtonsVisibility();  // Check if buttons need to be shown
}

// Function to delete a todo item
function onDeleteTodoItem(todoId) {
    let todoIdEl = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoIdEl);

    let deleteIndex = todoList.findIndex(function(eachtodo) {
        let eachTodoId = "todo" + eachtodo.uniqueNo;
        return eachTodoId === todoId;
    });
    todoList.splice(deleteIndex, 1);

    toggleButtonsVisibility();  // Check if buttons need to be hidden
}

// Function to clear all todo items
clearAllButton.onclick = function() {
    todoItemsContainer.innerHTML = ""; // Remove all todo items from the DOM
    todoList = []; // Clear the todoList array
    localStorage.setItem("todoList", JSON.stringify(todoList)); // Update localStorage

    toggleButtonsVisibility(); // Hide buttons when no todos remain
};

// Call toggleButtonsVisibility when the page is loaded to adjust button visibility
toggleButtonsVisibility();

// Ensure that when a todo item is added, the buttons are visible
onAddTodoButton.onclick = function() {
    onAddTodo();
}

// Event listener for the Enter key to add todos
let userTodoInput = document.getElementById("userTodoInput");

userTodoInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        onAddTodo(); // Calls the function to add the item to the list
    }
});

// Load todos from localStorage and display them
for (let todo of todoList) {
    createAndAppendTodo(todo);
}

// After loading todos, update the button visibility
toggleButtonsVisibility();
*/