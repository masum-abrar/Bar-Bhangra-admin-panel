'use client'
import { useEffect, useState } from 'react'
import API from '@/libs/api'
import LiftTypeCard from './components/LiftTypeCard'
import LiftTypeModal from './components/LiftTypeModal'
import Sidebar from '@/app/components/Sidebar'
import toast, { Toaster } from 'react-hot-toast'

export default function LiftTypePage() {
  const [liftTypes, setLiftTypes] = useState([])
  const [services, setServices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const fetchData = async () => {
    try {
      const [liftRes, serviceRes] = await Promise.all([
        API.get('/lift-types'),
        API.get('/services')
      ])
      setLiftTypes(liftRes.data)
      setServices(serviceRes.data)
    } catch {
      toast.error('Failed to fetch data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = async formData => {
    try {
      await toast.promise(
        API.post('/lift-types', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        {
          loading: 'Creating lift type...',
          success: 'Lift type created 🎉',
          error: 'Failed to create lift type'
        }
      )
      fetchData()
      setIsModalOpen(false)
    } catch {}
  }

  const handleUpdate = async formData => {
    if (!editData?.id) {
      toast.error('No lift type selected')
      return
    }

    try {
      await toast.promise(
        API.put(`/lift-types/${editData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
        {
          loading: 'Updating lift type...',
          success: 'Lift type updated ✅',
          error: 'Failed to update lift type'
        }
      )
      fetchData()
      setIsModalOpen(false)
      setEditData(null)
    } catch {}
  }

  const handleDelete = id => {
    // custom toast confirmation instead of browser confirm
    toast(
      t => (
        <div className="flex flex-col gap-2 bg-white p-4 rounded shadow-md">
          <span>Delete this lift type?</span>
          <div className="flex gap-2 justify-end">
            <button
              className="bg-red-500 px-3 py-1 text-white rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await toast.promise(
                    API.delete(`/lift-types/${id}`),
                    {
                      loading: 'Deleting...',
                      success: 'Lift type deleted 🗑️',
                      error: 'Delete failed ❌'
                    }
                  )
                  fetchData()
                } catch {}
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 rounded border text-sm"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }

  return (
    <div className="flex min-h-screen">
      <Toaster
        position="top-center"
      
      />

      <Sidebar />
      <div className="flex-1 bg-gray-100 mx-auto p-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">Lift Types</h1>
          <button
            className="bg-green-600 px-4 py-2 rounded text-white"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New
          </button>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {liftTypes?.map(lift => (
            <LiftTypeCard
              key={lift.id}
              item={lift}
              onEdit={data => {
                setEditData(data)
                setIsModalOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <LiftTypeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditData(null)
          }}
          onSubmit={editData ? handleUpdate : handleCreate}
          initialData={editData}
          services={services}
        />
      </div>
    </div>
  )
}
