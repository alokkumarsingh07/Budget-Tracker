import { useState, useContext, useEffect } from "react";
import AuthContext from "../store/auth-context";

const DailyExpenses = () => {
  const authCtx = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

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
            const expensesArray = Object.values(data).map(([key, value]) => ({
              id: key,
              ...value,
            }));
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

  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const expenseData = {
  //     amount: amount,
  //     description: description,
  //     category: category,
  //   };

  //   console.log("Expense added:", { amount, description, category });

  //   fetch(
  //     `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}.json`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify(expenseData),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       if (response.ok) {
  //         console.log("Expense added successfully");
  //         setAmount("");
  //         setDescription("");
  //         setCategory("");
  //       } else {
  //         throw new Error("Failed to add expense");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error adding expense:", error);
  //     });
  // };
  // const deleteExpenseHandler = (id) => {
  //   fetch(
  //     `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}/${id}.json`,
  //     {
  //       method: "DELETE",
  //     }
  //   )
  //     .then((response) => {
  //       if (response.ok) {
  //         console.log("Expense successfully deleted");
  //         setExpenses((prevExpenses) =>
  //           prevExpenses.filter((expense) => expense.id !== id)
  //         );
  //       } else {
  //         throw new Error("Failed to delete expense");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting expense:", error);
  //     });
  // };

  // const editExpenseHandler = (id) => {
  //   const expenseToEdit = expenses.find((expense) => expense.id === id);

  //   setAmount(expenseToEdit.amount);
  //   setDescription(expenseToEdit.description);
  //   setCategory(expenseToEdit.category);

  //   const handleEditSubmit = (event) => {
  //     event.preventDefault();

  //     const updatedExpenseData = {
  //       amount: amount,
  //       description: description,
  //       category: category,
  //     };

  //     fetch(
  //       `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}/${id}.json`,
  //       {
  //         method: "PUT",
  //         body: JSON.stringify(updatedExpenseData),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then((response) => {
  //         if (response.ok) {
  //           console.log("Expense updated successfully");

  //           setExpenses((prevExpenses) =>
  //             prevExpenses.map((expense) =>
  //               expense.id === id ? { id: id, ...updatedExpenseData } : expense
  //             )
  //           );
  //         } else {
  //           throw new Error("Failed to update expense");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error updating expense:", error);
  //       });
  //   };
  // };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amount.trim() || !description.trim() || !category.trim()) {
      console.error("Please fill out all fields.");
      return;
    }

    const expenseData = {
      amount: amount,
      description: description,
      category: category,
    };

    if (!editingExpenseId) {
      fetch(
        `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}.json`,
        {
          method: "POST",
          body: JSON.stringify(expenseData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Expense added successfully");
            setExpenses((prevExpenses) => [
              ...prevExpenses,
              { id: response.name, ...expenseData },
            ]);
            setAmount("");
            setDescription("");
            setCategory("");
          } else {
            throw new Error("Failed to add expense");
          }
        })
        .catch((error) => {
          console.error("Error adding expense:", error);
        });
    } else {
      fetch(
        `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}/${editingExpenseId}.json`,
        {
          method: "PUT",
          body: JSON.stringify(expenseData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            console.log("Expense updated successfully");
            setExpenses((prevExpenses) =>
              prevExpenses.map((expense) =>
                expense.id === editingExpenseId
                  ? { id: editingExpenseId, ...expenseData }
                  : expense
              )
            );
            setAmount("");
            setDescription("");
            setCategory("");
            setEditingExpenseId(null);
          } else {
            throw new Error("Failed to update expense");
          }
        })
        .catch((error) => {
          console.error("Error updating expense:", error);
        });
    }
  };

  const editExpenseHandler = (id) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    setAmount(expenseToEdit.amount);
    setDescription(expenseToEdit.description);
    setCategory(expenseToEdit.category);
    setEditingExpenseId(id);
  };

  const deleteExpenseHandler = (id) => {
    fetch(
      `https://react-auth-9e7aa-default-rtdb.firebaseio.com/expenses/${authCtx.userId}/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Expense successfully deleted");
          setExpenses((prevExpenses) =>
            prevExpenses.filter((expense) => expense.id !== id)
          );
        } else {
          throw new Error("Failed to delete expense");
        }
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
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
          {expenses.map((expense) => (
            <li key={expense.id}>
              Amount: {expense.amount}, Description: {expense.description},
              Category: {expense.category}
              <button onClick={() => editExpenseHandler(expense.id)}>
                Edit
              </button>
              <button onClick={() => deleteExpenseHandler(expense.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DailyExpenses;
