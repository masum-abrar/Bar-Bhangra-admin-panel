export default function ContactModal({ onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      message: e.target.message.value,
    };
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white shadow p-6 rounded w-96">
        <h2 className="mb-4 font-bold text-lg">Add Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" placeholder="Name" className="p-2 border w-full" required />
          <input name="email" placeholder="Email" className="p-2 border w-full" required />
          <input name="phone" placeholder="Phone" className="p-2 border w-full" />
          <textarea name="message" placeholder="Message" className="p-2 border w-full" required />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-400 px-4 py-2 rounded text-white">Cancel</button>
            <button type="submit" className="bg-blue-500 px-4 py-2 rounded text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
