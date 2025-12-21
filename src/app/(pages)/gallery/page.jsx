'use client'
import { useEffect, useState } from 'react'
import GalleryCard from './components/GalleryCard'
import GalleryModal from './components/GalleryModal'
import API from '@/libs/api'
import Sidebar from '@/app/components/Sidebar'
import toast, { Toaster } from 'react-hot-toast'

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const fetchGallery = async () => {
    try {
      const res = await API.get('/gallery')
      setGalleries(res.data)
    } catch {
      toast.error('Failed to fetch galleries')
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const handleCreate = async formData => {
    try {
      await toast.promise(
        API.post('/gallery', formData),
        {
          loading: 'Creating gallery...',
          success: 'Gallery created 🎉',
          error: 'Failed to create gallery',
        }
      )
      fetchGallery()
      setIsModalOpen(false)
    } catch {}
  }

  const handleUpdate = async formData => {
    if (!editData?.id) {
      toast.error('No gallery selected')
      return
    }

    try {
      await toast.promise(
        API.put(`/gallery/${editData.id}`, formData),
        {
          loading: 'Updating gallery...',
          success: 'Gallery updated ✅',
          error: 'Failed to update gallery',
        }
      )
      fetchGallery()
      setIsModalOpen(false)
      setEditData(null)
    } catch {}
  }

  const handleDelete = (id) => {
    // custom toast confirmation
    toast(
      t => (
        <div className="flex flex-col gap-2 bg-white p-4 rounded shadow-md">
          <span>Delete this gallery?</span>
          <div className="flex gap-2 justify-end">
            <button
              className="bg-red-500 px-3 py-1 text-white rounded text-sm"
              onClick={async () => {
                toast.dismiss(t.id)
                try {
                  await toast.promise(
                    API.delete(`/gallery/${id}`),
                    {
                      loading: 'Deleting...',
                      success: 'Gallery deleted 🗑️',
                      error: 'Delete failed ❌',
                    }
                  )
                  fetchGallery()
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
          <h1 className="font-bold text-2xl">Gallery</h1>
          <button
            className="bg-green-600 px-4 py-2 rounded text-white"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New
          </button>
        </div>

        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {galleries?.map(item => (
            <GalleryCard
              key={item.id}
              item={item}
              onEdit={data => {
                setEditData(data)
                setIsModalOpen(true)
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <GalleryModal
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
