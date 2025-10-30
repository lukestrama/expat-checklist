'use client'
import { useState } from "react";
import { COUNTRIES } from "./utils/countries";
import { Checklist } from "./components/Checklist";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  originCountry: string,
  destination: string
}

interface ApiResponse {
    output: Array<{
      content: Array<{
        text: string;
      }>;
    }>;
  }

export default function Home() {
  const [checklist, setChecklist] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      originCountry: 'Select Origin',
      destination: 'Select Destination'
    }
  })

  interface IFormInput {
    originCountry: string
    destination: string
  }

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const { originCountry, destination } = data
    setIsLoading(true)
    setChecklist('')

    fetch('/api/checklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ originCountry, destination })
    })
      .then(response => response.json())
      .then((data: ApiResponse) => {
        console.log(data)
        setChecklist(data.output[1].content[0].text)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error:', error)
        setIsLoading(false)
      })
  }

  return (
    <div className="relative bg-[#FFF1E2] flex flex-col font-sans mb-auto min-h-screen mx-auto p-5 sm:pt-20">
      <Image className="absolute top-[-15px] right-0 z-0" src="/images/palm_tree.png" width={300} height={300} alt="Picture of a palm tree" priority />
      <section className="w-full text-center sm:text-left sm:w-[50%] p-2 sm:pl-10 z-1">
        <div>
          <h1 className="text-5xl font-900">Expat Checklist</h1>
          <p className="my-6 leading-7">Select your origin and destination countries to get a list of tasks to do before and after you arrive.</p>
        </div>
      </section>
      <div className="bg-white mx-4 sm:mx-10 py-2 sm:py-5 px-5 sm:px-10 rounded-3xl z-1">
        <form className="max-w-full grid grid-cols-2 gap-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl">
            Origin
          </div>
          <div className="text-xl">
            Destination
          </div>
          <select className="cursor-pointer hover:bg-gray-300 border-gray-500 border-solid border-1"  {...register("originCountry", {
            required: {
              value: true,
              message: 'Select an origin country'
            },
          })}>
            {COUNTRIES.map((country, idx) => {
              return <option key={idx} value={country}>{country}</option>
            })}
          </select>
          <select className="cursor-pointer hover:bg-gray-300 border-gray-500 border-solid border-1"  {...register("destination", { required: { value: true, message: 'Select an destination country'}, })}>
            {COUNTRIES.map((country, idx) => {
              return <option key={idx} value={country}>{country}</option>
            })}
          </select>
            <p className="text-red-500">{errors.originCountry?.message}</p>
          <p className="text-red-500">{errors.destination?.message}</p>
          <button className={`col-span-2 border-1 border-solid border-teal-500 text-teal-500 py-2 px-4 rounded-lg my-4 hover:bg-teal-500 hover:text-white ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`} type="submit" disabled={isLoading}>{isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Generate checklist"}</button>
        </form>
        {checklist && (
          <Checklist checklist={checklist} />
        )}
      </div>
    </div>
  );
}
