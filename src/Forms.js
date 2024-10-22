import React, { useState } from "react";

export default function Forms() {
  const [age, setAge] = useState("");
  const [ageOperator, setAgeOperator] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryOperator, setSalaryOperator] = useState("");
  const [experience, setExperience] = useState("");
  const [experienceOperator, setExperienceOperator] = useState("");
  const [department, setDepartment] = useState("");
  const [result, setResult] = useState("False");
  const [resultFetched, setResultFetched] = useState(false);
  const handleEvaluateRule = () => {
    setResultFetched(!resultFetched);
  };
  return (
    <div>
      <div className=" mt-0 pt-5 border-2 mx-[20%] rounded-2xl">
        <p className=" text-center text-3xl font-bold">Data To Check</p>
        <div className=" ml-20">
          <div className=" flex text-black gap-x-5 py-2">
            <p className=" text-xl font-bold">Check for Rule:</p>

            <select className="border-[1px] rounded-md px-2">
              <option>Rule 1</option>
            </select>
          </div>
          <div className=" flex text-black gap-x-5 py-2">
            <p className=" text-xl font-bold">Age:</p>

            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className=" border-[1px] rounded-md px-2"
            />
          </div>
          <div className=" flex text-black gap-x-5 py-2">
            <p className=" text-xl font-bold">Salary:</p>

            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className=" border-[1px] rounded-md px-2"
            />
          </div>
          <div className=" flex text-black gap-x-5 py-2">
            <p className=" text-xl font-bold">Experience:</p>

            <input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className=" border-[1px] rounded-md px-2"
            />
          </div>

          <div className="flex text-black gap-x-5 py-2">
            <p className=" text-xl font-bold">Department:</p>
            <input
              value={age}
              onChange={(e) => setDepartment(e.target.value)}
              className=" border-[1px] rounded-md px-2"
            />
          </div>
        </div>
        <div className=" my-2 flex items-center justify-center ">
          <button
            className=" bg-blue-600 p-2 rounded-lg text-white text-center"
            onClick={() => handleEvaluateRule()}
          >
            Evaluate Rule
          </button>
        </div>
      </div>
      {resultFetched && (
        <div className=" mt-12 border-2 py-5 mx-[30%] flex items-center justify-center">
          <div className=" flex flex-col items-center">
            <p className=" text-3xl font-bold">Result</p>
            <p className=" text-3xl font-bold text-red-700 py-2">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
