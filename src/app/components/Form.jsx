'use client'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Form({ initialData = {}, onSubmit, onCancel, type }) {
  const [title, setTitle] = useState(initialData.title || '')
  const [description, setDescription] = useState(initialData.description || '')
  const [images, setImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  // revoke old object URLs to avoid memory leak
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleImageChange = e => {
    // revoke previous previews
    previewUrls.forEach(url => URL.revokeObjectURL(url))

    const files = Array.from(e.target.files || [])
    setImages(files)
    const previews = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(previews)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Optional validation: require images on Add
    if (type === 'Add' && images.length === 0) {
      toast.error('Please select at least one image.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    images.forEach(img => formData.append('images', img))

    // Use toast.promise to show loading / success / error states
    try {
      await toast.promise(
        onSubmit(formData),
        {
          loading: type === 'Add' ? 'Submitting...' : 'Updating...',
          success: type === 'Add' ? 'Submitted successfully!' : 'Updated successfully!',
          error: (err) => {
            // If backend returns useful message, pass it: err?.message or string
            const msg = err?.message || 'Operation failed'
            return msg
          }
        },
        // optional config
        { duration: 4000 }
      )
    } catch (err) {
      // handled by toast.promise already, but we can log if needed
      console.error('submit error:', err)
    }
  }

  return (
    <>
      {/* If you already have <Toaster /> in your _app or layout, remove this line to avoid duplicates */}
      <Toaster position="top-right" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="px-3 py-2 border rounded w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="px-3 py-2 border rounded w-full"
          rows={4}
          required
        ></textarea>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full"
          required={type === 'Add'}
        />

        {/* Image Previews */}
        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`preview-${idx}`}
                className="border rounded w-24 h-24 object-cover"
              />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              onCancel?.()
              toast('Cancelled', { icon: '✖️' })
            }}
            className="bg-gray-400 px-4 py-2 rounded text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
          >
            {type === 'Add' ? 'Submit' : 'Update'}
          </button>
        </div>
      </form>
    </>
  )
}
