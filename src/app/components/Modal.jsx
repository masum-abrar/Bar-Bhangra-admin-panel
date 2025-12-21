// components/Modal.jsx
'use client'

export default function Modal ({ title, onClose, children }) {
  
  return (
    <div className='z-50 fixed inset-0 flex justify-center items-center bg-black/30'>
      <div className='relative bg-white shadow-lg p-6 rounded-lg w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-semibold text-xl'>{title}</h2>
          <button onClick={onClose} className='text-xl'>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
