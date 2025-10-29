import { CHECKLIST_SECTIONS } from '../utils/constants'
import { useState } from 'react'

interface ChecklistItem {
    task: string,
    description: string,
}

type Views = CHECKLIST_SECTIONS.BEFORE_LEAVING | CHECKLIST_SECTIONS.AFTER_ARRIVING

export const Checklist = ({ checklist }: { checklist: string }) => {
    const [currentView, setCurrentView] = useState<Views>(CHECKLIST_SECTIONS.BEFORE_LEAVING)
    
    const checklistParsed = JSON.parse(checklist)

    const handleToggle = (view: Views) => {
        if (currentView === view) return
        setCurrentView(view)
    }

    return (
        <div className='w-full'>
            <div className='grid grid-cols-2 w-full text-center mb-4'>
                <button
                    className={`${currentView === CHECKLIST_SECTIONS.BEFORE_LEAVING ? 'bg-teal-500 text-white' : 'hover:bg-teal-100'} cursor-pointer rounded-l-xl`}
                    type='button'
                    onClick={() => handleToggle(CHECKLIST_SECTIONS.BEFORE_LEAVING)}>
                    <h2 className='text-lg font-900 p-4'>Before leaving</h2>
                </button>
                <button
                    className={`${currentView === CHECKLIST_SECTIONS.AFTER_ARRIVING ? 'bg-teal-500 text-white' : 'hover:bg-teal-100'} cursor-pointer rounded-r-xl`}
                    type='button'
                    onClick={() => handleToggle(CHECKLIST_SECTIONS.AFTER_ARRIVING)}>
                    <h2 className='text-lg font-900 p-4'>After arriving</h2>
                </button>
            </div>
            {currentView === CHECKLIST_SECTIONS.BEFORE_LEAVING && (
                checklistParsed[CHECKLIST_SECTIONS.BEFORE_LEAVING].map((item: ChecklistItem, idx: number) => {
                    return (
                        <div className='flex flex-col' key={idx}>
                            <h4 className='mb-0 text-md'>{item.task}</h4>
                            <p className='px-4 pb-4 text-sm'>{item.description}</p>
                        </div>
                    )
                }))}
            {currentView === CHECKLIST_SECTIONS.AFTER_ARRIVING && (
                checklistParsed[CHECKLIST_SECTIONS.AFTER_ARRIVING].map((item: ChecklistItem, idx: number) => {
                    return (
                        <div className='flex flex-col' key={idx}>
                            <h4 className='mb-0 text-md'>{item.task}</h4>
                            <p className='px-4 pb-4 text-sm'>{item.description}</p>
                        </div>
                    )
                }))}
        </div>
    )
}
