'use client'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useEffect } from 'react'

export default function GalleryModal ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title)
      setDescription(initialData.description)
    } else {
      setTitle('')
      setDescription('')
      setImages([])
    }
  }, [initialData])

  const handleSubmit = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i])
    }
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='z-50 relative'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex justify-center items-center p-4'>
        <DialogPanel className='bg-white shadow p-6 rounded w-full max-w-md'>
          <DialogTitle className='mb-4 font-bold text-lg'>
            {initialData ? 'Edit Gallery' : 'Create Gallery'}
          </DialogTitle>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              placeholder='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className='p-2 border rounded w-full'
            />
            <textarea
              placeholder='Description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className='p-2 border rounded w-full'
            ></textarea>
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={e => {
                const newFiles = Array.from(e.target.files)
                setImages(prev => [...prev, ...newFiles])
              }}
              className='p-2 border rounded w-full'
            />
            {images.length > 0 && (
              <div className='gap-2 grid grid-cols-3'>
                {images.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${i}`}
                    className='rounded w-20 h-20 object-cover'
                  />
                ))}
              </div>
            )}

            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={onClose}
                className='bg-gray-300 px-4 py-2 rounded'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='bg-green-600 px-4 py-2 rounded text-white'
              >
                {initialData ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
