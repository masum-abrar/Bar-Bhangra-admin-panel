'use client'
import { useEffect, useState } from 'react'
import ServiceCard from './components/ServiceCard'
import ServiceModal from './components/ServiceModal'
import API from '@/libs/api'
import Link from 'next/link'
import Sidebar from '@/app/components/Sidebar'
import toast, { Toaster } from 'react-hot-toast'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const fetchServices = async () => {
    try {
      const res = await API.get('/services')
      setServices(res.data)
    } catch (err) {
      toast.error('Failed to fetch services')
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleCreate = async formData => {
    try {
      await toast.promise(
        API.post('/services', formData),
        {
          loading: 'Creating service...',
          success: 'Service created successfully 🎉',
          error: 'Failed to create service',
        }
      )
      fetchServices()
      setIsModalOpen(false)
    } catch {}
  }

  const handleUpdate = async formData => {
    if (!editData?.id) {
      toast.error('No service selected')
      return
    }
    try {
      await toast.promise(
        API.put(`/services/${editData.id}`, formData),
        {
          loading: 'Updating service...',
          success: 'Service updated ✅',
          error: 'Failed to update service',
        }
      )
      fetchServices()
      setIsModalOpen(false)
      setEditData(null)
    } catch {}
  }

  const handleDelete = (id) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2 bg-white p-4 rounded shadow-md">
        <span>Delete this service?</span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id) // ✅ dismiss toast using id
              try {
                await toast.promise(
                  API.delete(`/services/${id}`),
                  {
                    loading: 'Deleting service...',
                    success: 'Service deleted 🗑️',
                    error: 'Failed to delete service',
                  }
                )
                fetchServices()
              } catch {}
            }}
            className="bg-red-500 px-3 py-1 text-white rounded text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // dismiss toast
            className="px-3 py-1 rounded border text-sm"
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
      {/* Toaster - ekbar root layout e dile best, ekhane test er jonno rakhchi */}
      <Toaster position="top-center" />

      <Sidebar />
      <div className="flex-1 bg-gray-100 mx-auto p-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">Services</h1>
          <div className="flex gap-4">
            {/* <button
              className="bg-green-600 px-4 py-2 rounded text-white"
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Service
            </button> */}
            <Link
              href="/lift-types"
              className="bg-sky-700 px-4 py-2 rounded text-white"
            >
              See Lift Types
            </Link>
          </div>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {services?.map(service => (
            <ServiceCard
              key={service.id}
              item={service}
              onEdit={data => {
                setEditData(data)
                setIsModalOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditData(null)
          }}
          onSubmit={editData ? handleUpdate : handleCreate}
          initialData={editData}
        />
      </div>
    </div>
  )
}
