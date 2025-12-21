export default function LiftTypeCard({ item, onEdit, onDelete }) {
  // Use Cloudinary URL directly if available
  const imageUrl = item.image || "/placeholder.png"; // fallback image

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold text-xl">{item.title}</h2>
      <p className="text-gray-500 text-sm">{item.description}</p>
      <p className="text-gray-400 text-xs">Badge: {item.badge}</p>
      <img
        src={imageUrl}
        alt="lift"
        className="my-2 rounded w-full h-40 object-cover"
      />
      <ul className="ml-5 text-blue-600 text-sm list-disc">
        {item.feature?.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <p className="mt-2 text-gray-600 text-xs">
        Service: {item.service?.title || "Unknown"}
      </p>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => onEdit(item)}
          className="bg-blue-500 px-3 py-1 rounded text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-red-500 px-3 py-1 rounded text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
