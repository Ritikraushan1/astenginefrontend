import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Rules() {
  const [rulesAdded, setRulesAdded] = useState([]);
  const [ruleName, setRuleName] = useState("");
  const [conditions, setConditions] = useState([
    { ruleType: "age", operator: "=", value: "" },
  ]);
  const [logicOperator, setLogicOperator] = useState("AND"); // Operator to combine conditions
  const [combinedRule, setCombinedRule] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [selectedRule1, setSelectedRule1] = useState("");
  const [selectedRule2, setSelectedRule2] = useState("");
  const [combineOperator, setCombineOperator] = useState("AND");

  const handleConditionChange = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
  };
  useEffect(() => {
    getRules();
  }, []);

  const addCondition = () => {
    setConditions([
      ...conditions,
      { ruleType: "age", operator: "=", value: "" },
    ]);
  };
  const astToString = (ast) => {
    if (ast.type === "operand") {
      return ast.left;
    } else if (ast.type === "operator") {
      const leftString = astToString(ast.left);
      const rightString = astToString(ast.right);
      return `(${leftString} ${ast.value} ${rightString})`;
    }
    return "";
  };

  const getRules = () => {
    axios
      .get("http://localhost:4000/api/rules/all-rule")
      .then((response) => {
        console.log("response after getting rules", response);
        const ruleStrings = response.data.map((rule) => astToString(rule.ast));
        setRulesAdded(ruleStrings);
      })
      .catch((error) => {
        console.error("Error getting rule:", error);
        // alert("Failed to get rules. Please try again.");
      });
  };

  const handleRule = () => {
    if (!ruleName) {
      alert("Please enter a rule name.");
      return;
    }

    const ruleString = conditions
      .map((cond) => {
        if (cond.ruleType === "Department") {
          return `${cond.ruleType} = '${cond.value}'`;
        } else {
          return `${cond.ruleType} ${cond.operator} ${cond.value}`;
        }
      })
      .join(` ${logicOperator} `);
    setCombinedRule(ruleString);
    console.log("Created Rule:", ruleString);
    axios
      .post("http://localhost:4000/api/rules/create-rule", {
        ruleString: ruleString,
      })
      .then((response) => {
        console.log("Response from API:", response.data);
        alert("Rule successfully created!");
      })
      .catch((error) => {
        console.error("Error creating rule:", error);
        alert("Failed to create rule. Please try again.");
      });
  };
  const handleCombineRules = () => {
    if (!selectedRule1 || !selectedRule2) {
      alert("Please select two rules to combine.");
      return;
    }

    const combinedRule = `(${selectedRule1}) ${combineOperator} (${selectedRule2})`;
    console.log("Combining rules:", combinedRule);

    axios
      .post("http://localhost:4000/api/rules/create-rule", {
        ruleString: combinedRule,
      })
      .then((response) => {
        console.log("Response from API:", response.data);
        alert("Rules successfully combined!");
        setIsPopupOpen(false); // Close the popup after successful submission
        getRules(); // Refresh the rules
      })
      .catch((error) => {
        console.error("Error combining rules:", error);
        alert("Failed to combine rules. Please try again.");
      });
  };

  return (
    <div>
      <div className=" mt-0 pt-5 border-2 mx-[20%] rounded-2xl">
        <p className=" text-center text-3xl font-bold">Set New Rules</p>
        <div className=" ml-20 pb-8">
          <div className=" flex gap-x-2">
            <p>Enter Rule Name:</p>
            <input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="border-[1px] rounded-md px-2 py-1"
              placeholder="Rule Name"
            />
          </div>

          {conditions.map((condition, index) => (
            <div key={index} className="flex text-black gap-x-5 py-2">
              <select
                className="border-[1px] py-1 rounded-md px-2"
                value={condition.ruleType}
                onChange={(e) =>
                  handleConditionChange(index, "ruleType", e.target.value)
                }
              >
                <option value="age">Age</option>
                <option value="salary">Salary</option>
                <option value="experience">Experience</option>
                <option value="department">Department</option>
              </select>
              {condition.ruleType !== "Department" && (
                <select
                  className="border-[1px] py-1 rounded-md px-2"
                  value={condition.operator}
                  onChange={(e) =>
                    handleConditionChange(index, "operator", e.target.value)
                  }
                >
                  <option value="=">Equal to</option>
                  <option value=">">Greater Than</option>
                  <option value="<">Less than</option>
                  <option value="<=">Less than or equal to</option>
                  <option value=">=">Greater than or equal to</option>
                </select>
              )}
              <input
                type={condition.ruleType === "department" ? "text" : "number"}
                value={condition.value}
                onChange={(e) =>
                  handleConditionChange(index, "value", e.target.value)
                }
                className="border-[1px] rounded-md px-2 py-1"
                placeholder={
                  condition.ruleType === "department"
                    ? "Enter department"
                    : "Enter value"
                }
              />
            </div>
          ))}
          <div className="flex gap-x-3 pt-2">
            <button
              className="bg-blue-600 px-3 py-2 rounded-lg text-white"
              onClick={addCondition}
            >
              Add Condition
            </button>
            <select
              className="border-[1px] py-1 rounded-md px-2"
              value={logicOperator}
              onChange={(e) => setLogicOperator(e.target.value)}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
            <button
              className="bg-blue-600 px-3 py-2 rounded-lg text-white"
              onClick={handleRule}
            >
              Create Rule
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1>Rules</h1>
        <ul>
          {rulesAdded.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-bold">Created Rule:</p>
        <p className="text-gray-700">
          {combinedRule || "No rule created yet."}
        </p>
      </div>
      <button
        className="bg-blue-600 px-3 py-2 rounded-lg text-white mt-4"
        onClick={() => setIsPopupOpen(true)}
      >
        Combine Rules
      </button>
      {isPopupOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Combine Rules</h2>

            <div className="flex flex-col gap-y-4">
              <div>
                <label>Select Rule 1:</label>
                <select
                  className="border-[1px] py-1 rounded-md px-2"
                  value={selectedRule1}
                  onChange={(e) => setSelectedRule1(e.target.value)}
                >
                  <option value="">Select a rule</option>
                  {rulesAdded.map((rule, index) => (
                    <option key={index} value={rule}>
                      {rule}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Select Rule 2:</label>
                <select
                  className="border-[1px] py-1 rounded-md px-2"
                  value={selectedRule2}
                  onChange={(e) => setSelectedRule2(e.target.value)}
                >
                  <option value="">Select a rule</option>
                  {rulesAdded.map((rule, index) => (
                    <option key={index} value={rule}>
                      {rule}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Operator:</label>
                <select
                  className="border-[1px] py-1 rounded-md px-2"
                  value={combineOperator}
                  onChange={(e) => setCombineOperator(e.target.value)}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-x-4">
              <button
                className="bg-blue-600 px-3 py-2 rounded-lg text-white"
                onClick={handleCombineRules}
              >
                Combine
              </button>
              <button
                className="bg-gray-400 px-3 py-2 rounded-lg text-white"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
