    
    /* Lines of code used to fetch HTML elements by their id and to retrieve data from the localstorage.  */
    const myDate = document.getElementById("date");
    const myInput = document.getElementById("item-input");   
    const myList = document.getElementById("item-list");
    const btnSubmit = document.getElementById("submit");
    const btnSortByName = document.getElementById("sort-by-name-btn");
    const errorEl = document.getElementById("error-msg");
    const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : [];
    
    /* A function added to display the users current day, month and year in the Norwegian format. */
    function displaydate() {
        const date = new Date()
        const dateString = date.toLocaleDateString("no-NO", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        myDate.textContent = dateString;
    }

    /* An event which ensures that certain functions run when the page has finished loading. */
    window.onload = function(){
        displaydate()
        displayitems()
    };

    /* A eventlistener added to the submit button and when clicked it will call on a function that creates an array item out of the values put into the input field. */
    /* But before creating an item it checks to see if the inserted values consist of 3 items or more. If not an error message will be displayed. */
    btnSubmit.addEventListener("click", () => {
        const item = myInput.value;
        if (item.length < 3) {
            errorEl.textContent = "Please enter 3 or more characters";
        } else {
            createItem(item);
        }
    })

    /* An eventlistener created to listen if enter is ever pressed while the input field is in focus. */
    /* If the input value is 3 characters or more and enter is pressed it will run the create function and add the item to the to do list. */
    /* If the input value is below 3 characters in length an error message will display and the item will not be added to the list. */
    myInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const item = myInput.value;
            if (item.length < 3) {
                errorEl.textContent = "Please enter 3 or more characters";
            } else {
                createItem(item);
            }
        }
    })

    /* This is the function which runs and creates an array item out of values inserted into the input field and then pushes it into an array stored in the browser's local storage. */
    /* It also adds two properties to each array item making them into objects. Giving them a name and an id. */
    /* The name will be the same as the user entered in the input field. While the id will be a unique set of numbers. */
    function createItem(item){
        const newItem = {
            id: Date.now(),
            name: item
        };
        itemsArray.push(newItem)
        localStorage.setItem("items", JSON.stringify(itemsArray))
        location.reload()
    }

    /* A function responsible for rendering the items in the to-do list. Using a for loop to add the input value into an array stored in the local storage.  */
    /* It then proceeds to create a list item which appends to the parent list myList. Adding the input value as a list element in the to-do list. */
    /* And using a span tag the function adds a X behind the list item that runs a function if clicked on. This function will remove the list entry. */
    function displayitems() {
        myList.textContent = "";
        for (let i = 0; i < itemsArray.length; i++) {
            const listItem = document.createElement("li");
            listItem.textContent = itemsArray[i].name;
            myList.appendChild(listItem);

            let span = document.createElement("span");
            span.textContent = "\u00d7";
            const removeItemWithIndex = () => {
                removeItem(i);
            };
            span.addEventListener("click", removeItemWithIndex);
            listItem.appendChild(span);
        }
    }

        /* A event listener for each list item that runs a function depending on where you clicked using an if statement. *
        /* If the span is clicked it will run a click event which triggers a function that removes the to-do list item. */
    myList.addEventListener("click", function(event) {
        if (event.target.tagName === "SPAN") {
            event.target.parentElement.remove();
        }}, false);

        /* The function that runs to remove the list item after the click event has been triggered. */
        function removeItem(index) {
            itemsArray.splice(index, 1);
            updateLocalStorage();
            displayitems();
            sortItems("name")
        }

        /* A function that updates the local storage to keep the to-do list's information updated. This function is run when a new item has been added to the list and when an item is removed. */
        function updateLocalStorage() {
            localStorage.setItem("items", JSON.stringify(itemsArray));
        }

        /* A sorting function which sorts the array's objects by their name property. When clicked the button will sort them alphabetically in a ascending or descending order. */
        let currentSortOrder = "ascending"
        const sortOrder = () => currentSortOrder = currentSortOrder === "ascending" ? "descending" : "ascending"
        function sortItems(sortBy, array = itemsArray) {
            sortOrder()
            const isOrderAscending = currentSortOrder === "ascending" ? 1 : -1
            array.sort((a, b) => {
                if (a[sortBy] > b[sortBy]) return 1 * isOrderAscending;
                else if (a[sortBy] < b[sortBy]) return -1 * isOrderAscending;
                return 0;
            });
        }

        btnSortByName.addEventListener("click", () => {
            sortItems("name");
            displayitems();
        })

/* For testing purposes */
/* console.log(itemsArray) */