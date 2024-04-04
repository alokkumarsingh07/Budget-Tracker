import { useState } from "react";
import classes from "./StartingPageContent.module.css";
import CompleteUserProfile from "../Profile/CompleteUserProfile";

const StartingPageContent = () => {
  const [form, setForm] = useState(false);
  return (
    <section className={classes.starting}>
      <h1>Welcome to Expense Tracker</h1>
      {!form && <button onClick={() => setForm(true)}>Complete Profile</button>}
      {form && <CompleteUserProfile />}
    </section>
  );
};

export default StartingPageContent;
