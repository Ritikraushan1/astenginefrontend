import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Rules() {
  const [rulesAdded, setRulesAdded] = useState([]);
  const [conditions, setConditions] = useState([
    { ruleType: "Age", operator: "=", value: "" },
  ]);
  const [logicOperator, setLogicOperator] = useState("AND"); // Operator to combine conditions
  const [combinedRule, setCombinedRule] = useState("");

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
      { ruleType: "Age", operator: "=", value: "" },
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
        alert("Failed to get rules. Please try again.");
      });
  };

  const handleRule = () => {
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

  return (
    <div>
      <div className=" mt-0 pt-5 border-2 mx-[20%] rounded-2xl">
        <p className=" text-center text-3xl font-bold">Set New Rules</p>
        <div className=" ml-20">
          {conditions.map((condition, index) => (
            <div key={index} className="flex text-black gap-x-5 py-2">
              <select
                className="border-[1px] py-1 rounded-md px-2"
                value={condition.ruleType}
                onChange={(e) =>
                  handleConditionChange(index, "ruleType", e.target.value)
                }
              >
                <option value="Age">Age</option>
                <option value="Salary">Salary</option>
                <option value="Experience">Experience</option>
                <option value="Department">Department</option>
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
                type={condition.ruleType === "Department" ? "text" : "number"}
                value={condition.value}
                onChange={(e) =>
                  handleConditionChange(index, "value", e.target.value)
                }
                className="border-[1px] rounded-md px-2"
                placeholder={
                  condition.ruleType === "Department"
                    ? "Enter department"
                    : "Enter value"
                }
              />
            </div>
          ))}
          <div className="flex gap-x-3">
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
    </div>
  );
}
