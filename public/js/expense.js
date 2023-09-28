const expenseForm = document.getElementById('expenseForm');
const expensesList = document.getElementById('expensesList');

// Function to create a new list item with delete button
function createExpenseListItem(expense) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${expense.amount} - ${expense.category} - ${expense.description}`;
    
    // Add a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
        deleteExpense(expense.id); // Call the function to delete the expense
        listItem.remove(); // Remove the list item from the UI
    });
    listItem.appendChild(deleteButton);

    return listItem;
}

// Function to send a DELETE request to delete an expense
function deleteExpense(expenseId) {
    fetch(`/expenses/deleteExpense/${expenseId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Expense deleted successfully on the server
        } else {
            console.error('Error deleting expense');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Event listener for the form submission
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    // Create a new expense object (you can add more fields as needed)
    const expense = {
        amount,
        description,
        category
    };

    // Create a new list item and append it to the list
    const listItem = createExpenseListItem(expense);
    expensesList.appendChild(listItem);

    // Clear the form inputs
    expenseForm.reset();

    // Send the expense data to the server to save it in the database
    fetch('/expenses/addExpense', { // Updated route to /expenses/addExpense
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    })
    .then(response => {
        if (response.ok) {
            // Expense saved successfully in the database
            return response.json();
        } else {
            console.error('Error saving expense');
        }
    })
    .then(data => {
        // Create a list item for the newly saved expense and append it to the list
        const listItem = createExpenseListItem(data);
        expensesList.appendChild(listItem);

        // Clear the form inputs
        expenseForm.reset();
    })
    .catch(error => {
        console.error(error);
    });
});

// Event listener for the logout button
const logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', function () {
    // Redirect the user to the signup page
    window.location.href = 'signup.html';
});
