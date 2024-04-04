import { useState, useContext, useEffect } from "react";
import AuthContext from "../store/auth-context";

const DailyExpenses = () => {
  const authCtx = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (authCtx.isLoggedIn) {
      // Fetch expenses from Firebase Realtime Database when user is logged in
      fetch(
        `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}.json`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to fetch expenses");
        })
        .then((data) => {
          if (data) {
            const expensesArray = Object.values(data);
            setExpenses(expensesArray);
          } else {
            setExpenses([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching expenses:", error);
        });
    }
  }, [authCtx.isLoggedIn, authCtx.userId]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const expenseData = {
      amount: amount,
      description: description,
      category: category,
    };

    console.log("Expense added:", { amount, description, category });

    fetch(`https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}.json`, {
      method: 'POST',
      body: JSON.stringify(expenseData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log("Expense added successfully");
        setAmount("");
        setDescription("");
        setCategory("");
      } else {
        throw new Error("Failed to add expense");
      }
    })
    .catch(error => {
      console.error("Error adding expense:", error);
    });
  };

  return (
    <div>
      <h2>Daily Expenses</h2>
      {authCtx.isLoggedIn && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="amount">Amount Spent:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={handleCategoryChange}
            />
          </div>
          <button type="submit">Add Expense</button>
        </form>
      )}
      <div>
        <h3>Expenses Added:</h3>
        <ul>
          {expenses.map((expense, index) => (
            <li key={index}>
              Amount: {expense.amount}, Description: {expense.description},
              Category: {expense.category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyExpenses;
