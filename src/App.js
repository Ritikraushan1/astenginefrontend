import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Forms from "./Forms"; // Your Forms component
import Rules from "./Rules"; // Create a Rules component

function App() {
  // State to manage which component to display
  const [activeComponent, setActiveComponent] = useState("");

  const handleFormsClick = () => {
    setActiveComponent("forms");
  };

  const handleRulesClick = () => {
    setActiveComponent("rules");
  };

  return (
    <div className="App">
      <div className=" pt-20 pb-5 mx-[30%] justify-between flex text-2xl gap-x-4">
        <button
          className=" bg-blue-500 w-full rounded-lg text-white"
          onClick={handleFormsClick}
        >
          <button onClick={handleFormsClick}>Forms</button>
        </button>
        <button
          className=" bg-blue-500 w-full rounded-lg text-white"
          onClick={handleRulesClick}
        >
          <button onClick={handleRulesClick}>Rules</button>
        </button>
      </div>
      <div>
        {activeComponent === "forms" && <Forms />}
        {activeComponent === "rules" && <Rules />}
      </div>
    </div>
  );
}

export default App;
