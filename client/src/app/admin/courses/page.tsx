"use client"
import CreateCourse from '@/components/admin/course/CreateCourse'
import React, { useState } from 'react'

function Page() {
    const [isAddingCourse, setIsAddingCourse] = useState(true)

    return (
        <div className='w-full h-full p-8 text-white'>
            <div className="top flex items-center justify-between">
                <h1 className='text-2xl font-bold mb-4'>Courses</h1>
                <button
                    onClick={() => setIsAddingCourse(!isAddingCourse)}
                    className='bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition'
                >
                    {isAddingCourse ? 'Close' : 'Add Course'}
                </button>
            </div>

            {isAddingCourse && (
                <CreateCourse
                    isOpen={isAddingCourse}
                    onOpenChange={setIsAddingCourse}
                />
            )}
        </div>
    )
}

export default Page
