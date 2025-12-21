'use client'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useEffect } from 'react'

export default function ServiceModal ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')

  useEffect(() => {
    if (initialData) {
      setSlug(initialData.slug || '')
      setTitle(initialData.title || '')
      setShortDescription(initialData.shortDescription || '')
      setFullDescription(initialData.fullDescription || '')
    } else {
      setSlug('')
      setTitle('')
      setShortDescription('')
      setFullDescription('')
    }
  }, [initialData])

  const handleSubmit = e => {
    e.preventDefault()
    const data = { slug, title, shortDescription, fullDescription }
    onSubmit(data)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='z-50 relative'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex justify-center items-center p-4'>
        <DialogPanel className='bg-white shadow p-6 rounded w-full max-w-md'>
          <DialogTitle className='mb-4 font-bold text-lg'>
            {initialData ? 'Edit Service' : 'Create Service'}
          </DialogTitle>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='text'
              placeholder='Slug (unique)'
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
              className='p-2 border rounded w-full'
            />
            <input
              type='text'
              placeholder='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className='p-2 border rounded w-full'
            />
            <textarea
              placeholder='Short Description'
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              required
              rows={4}
              className='p-2 border rounded w-full'
            />
            <textarea
              placeholder='Full Description'
              value={fullDescription}
              rows={8}
              onChange={e => setFullDescription(e.target.value)}
              required
              className='p-2 border rounded w-full'
            />
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
