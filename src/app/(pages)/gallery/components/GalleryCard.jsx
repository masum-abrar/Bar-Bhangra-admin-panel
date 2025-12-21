export default function GalleryCard({ item, onEdit, onDelete }) {
  console.log(item);
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="font-bold text-lg">{item.title}</h2>
      <p className="text-gray-500 text-sm">{item.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {item.images.map((img, i) => (
          <img
            key={i}
            src={img} // just use the URL from Cloudinary
            alt="img"
            className="rounded w-24 h-24 object-cover"
          />
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
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
