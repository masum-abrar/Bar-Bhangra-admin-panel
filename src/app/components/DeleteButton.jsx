// components/DeleteButton.jsx
'use client'

import API from '@/libs/api'
import toast from 'react-hot-toast'

export default function DeleteButton({ id, endpoint, onDelete }) {
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await toast.promise(
        API.delete(`/${endpoint}/${id}`),
        {
          loading: 'Deleting...',
          success: 'Item deleted ✅',
          error: 'Delete failed ❌',
        }
      )
      onDelete()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white text-sm"
    >
      Delete
    </button>
  )
}
