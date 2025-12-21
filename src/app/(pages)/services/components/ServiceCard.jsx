import Link from "next/link";

export default function ServiceCard ({ item, onEdit, onDelete }) {
  return (
    <div className='bg-white shadow p-4 rounded'>
      <h2 className='font-bold text-xl'>{item?.title}</h2>
      <p className='text-gray-500'>{item?.shortDescription}</p>
      <p className='mt-1 text-gray-400 text-sm'>{item?.fullDescription}</p>

      <div className='mt-3 text-blue-600 text-sm'>
        {item?.liftTypes?.length > 0 && (
          <ul className='ml-4 list-disc'>
            {item.liftTypes.map((lt, idx) => (
              <li key={lt.id}>{lt.title}</li>
            ))}
          </ul>
        )}
      </div>

      <div className='flex justify-end gap-2 mt-4'>
        <Link href={`/services/${item.id}`}>
          <button className='bg-gray-300 px-3 py-1 rounded text-black'>
            Details
          </button>
        </Link>
        <button
          onClick={() => onEdit(item)}
          className='bg-blue-500 px-3 py-1 rounded text-white'
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className='bg-red-500 px-3 py-1 rounded text-white'
        >
          Delete
        </button>
      </div>
    </div>
  )
}
