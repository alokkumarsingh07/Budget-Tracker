import { useState, useContext } from "react";
import AuthContext from "../store/auth-context";

const DailyExpenses = () => {
  const authCtx = useContext(AuthContext);

 
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  
  const dummyExpenses = [
    { id: 1, amount: 10, description: "Lunch", category: "Food" },
    { id: 2, amount: 20, description: "Fuel", category: "Petrol" },
   
  ];

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
  
    console.log("Expense added:", { amount, description, category });
  
    setAmount("");
    setDescription("");
    setCategory("");
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
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Petrol">Petrol</option>
              
            </select>
          </div>
          <button type="submit">Add Expense</button>
        </form>
      )}
      {authCtx.isLoggedIn && (
        <div>
          <h3>Expenses Added:</h3>
          <ul>
            {dummyExpenses.map((expense) => (
              <li key={expense.id}>
                Amount: {expense.amount}, Description: {expense.description},
                Category: {expense.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DailyExpenses;
