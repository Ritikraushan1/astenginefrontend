import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Forms() {
  const [allRules, setAllRules] = useState([]);
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [department, setDepartment] = useState("");
  const [result, setResult] = useState("False");
  const [resultFetched, setResultFetched] = useState(false);
  const [selectedRule, setSelectedRule] = useState("");

  useEffect(() => {
    getRules();
  }, []);

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
  const handleEvaluateRule = () => {
    console.log("selectedrule", selectedRule);
    const isValid = evaluateRule(selectedRule, {
      age,
      salary,
      experience,
      department,
    });
    setResult(isValid ? "True" : "False");
    setResultFetched(true);
  };

  const getRules = () => {
    axios
      .get("http://localhost:4000/api/rules/all-rule")
      .then((response) => {
        console.log("Response after getting rules:", response.data);
        const ruleStrings = response.data.map((rule) => astToString(rule.ast));
        console.log("Formatted rules:", ruleStrings); // Log formatted rules
        setAllRules(ruleStrings);
      })
      .catch((error) => {
        console.error("Error getting rules:", error);
        alert("Failed to get rules. Please try again.");
      });
  };
  const evaluateRule = (rule, data) => {
    axios
      .post("http://localhost:4000/api/rules/evaluate-rule", {
        rule: rule,
        data: data,
      })
      .then((response) => {
        console.log("Response from API:", response.data);
        if (response.data.result) {
          setResult("True");
        }
        alert("Rule Matched!", response.data.result);
      })
      .catch((error) => {
        console.error("Error creating rule:", error);
        alert("Failed to create rule. Please try again.");
      });
  };

  return (
    <div>
      <div className="mt-0 pt-5 border-2 mx-auto rounded-2xl w-[60%]">
        <p className="text-center text-3xl font-bold">Data To Check</p>
        <div className="ml-10 mr-10 mt-5">
          <div className="flex text-black gap-x-5 py-2 items-center">
            <p className="text-xl font-bold">Check for Rule:</p>
            <select
              className="border-[1px] rounded-md px-2 py-1 w-full"
              onChange={(e) => setSelectedRule(e.target.value)}
            >
              <option>Select a Rule</option>
              {allRules.map((rule, index) => (
                <option key={index} value={rule}>
                  {rule}
                </option>
              ))}
            </select>
          </div>
          <div className="flex text-black gap-x-5 py-2 items-center">
            <p className="text-xl font-bold">Age:</p>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border-[1px] rounded-md px-2 py-1 w-full"
            />
          </div>
          <div className="flex text-black gap-x-5 py-2 items-center">
            <p className="text-xl font-bold">Salary:</p>
            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="border-[1px] rounded-md px-2 py-1 w-full"
            />
          </div>
          <div className="flex text-black gap-x-5 py-2 items-center">
            <p className="text-xl font-bold">Experience:</p>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="border-[1px] rounded-md px-2 py-1 w-full"
            />
          </div>
          <div className="flex text-black gap-x-5 py-2 items-center">
            <p className="text-xl font-bold">Department:</p>
            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border-[1px] rounded-md px-2 py-1 w-full"
            />
          </div>
        </div>
        <div className="my-4 flex items-center justify-center">
          <button
            className="bg-blue-600 p-2 rounded-lg text-white"
            onClick={handleEvaluateRule}
          >
            Evaluate Rule
          </button>
        </div>
      </div>
      {resultFetched && (
        <div className="mt-12 border-2 py-5 mx-auto w-[40%] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <p className="text-3xl font-bold">Result</p>
            <p className="text-3xl font-bold text-red-700 py-2">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
