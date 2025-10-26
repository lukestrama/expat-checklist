'use client'
import { useState } from "react";
import { COUNTRIES } from "./utils/countries";
import { getChecklistFromOpenAI } from "./utils/api";
import { Checklist } from "./components/Checklist";

export default function Home() {
  const [origin, setOrigin] = useState('Select Origin')
  const [destination, setDestination] = useState('Select Destination')
  const [checklist, setChecklist] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [displayLoadingMessage, setDisplayLoadingMessage] = useState(false)

  const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrigin(e.target.value)
  }

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestination(e.target.value)
  }

  const handleSubmit = () => {
    setIsLoading(true)
    setChecklist('')
    
    setTimeout(() => {
      setDisplayLoadingMessage(true)
    }, 5000)

    getChecklistFromOpenAI({ origin, destination })
      .then(data => data.json())
      .then(data => {
        console.log(data)
        setChecklist(data.output[1].content[0].text)
        setIsLoading(false)
        setDisplayLoadingMessage(false)
      })
  }



  return (
    <div className="bg-zinc-50 flex flex-col font-sans mb-auto min-h-screen mx-auto p-10">
      <div className="max-w-full grid grid-cols-2 gap-2">
        <div className="text-xl">
          Origin
        </div>
        <div className="text-xl">
          Destination
        </div>
        <select className="cursor-pointer hover:bg-gray-300 border-gray-500 border-solid border-1" value={destination} onChange={handleDestinationChange}>
          <option value={'Select Origin'}>{"Select Destination"}</option>
          {COUNTRIES.map((country, idx) => {
            return <option key={idx} value={country}>{country}</option>
          })}
        </select>
        <select className="cursor-pointer hover:bg-gray-300 border-gray-500 border-solid border-1"  value={origin} onChange={handleOriginChange}>
          <option value={'Select Origin'}>{"Select Origin"}</option>
          {COUNTRIES.map((country, idx) => {
            return <option key={idx} value={country}>{country}</option>
          })}
        </select>
      </div>
      {displayLoadingMessage && (
        <p className="pt-2 text-center">Working on it still...</p>
      )}
      <button className="border-1 border-solid border-teal-500 text-teal-500 py-2 px-4 rounded-lg my-4 hover:bg-teal-500 hover:text-white cursor-pointer" onClick={handleSubmit} disabled={isLoading}>{isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Generate checklist"}</button>
      {checklist && (
        <Checklist checklist={checklist} />
      )}
    </div>
  );
}
