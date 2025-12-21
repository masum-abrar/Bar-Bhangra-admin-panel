"use client";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";

export default function LiftTypeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  services,
}) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState("");
  const [serviceId, setServiceId] = useState("");
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setBadge(initialData.badge || "");
      setDescription(initialData.description || "");
      setFeature(initialData.feature?.join(", ") || "");
      setServiceId(initialData.serviceId || "");
      setPreview(initialData.image || "");
      setImage(null);
    } else {
      setTitle("");
      setBadge("");
      setDescription("");
      setFeature("");
      setServiceId("");
      setImage(null);
      setPreview("");
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("badge", badge);
    formData.append("description", description);
    formData.append("feature", feature);
    formData.append("serviceId", serviceId);
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="z-50 relative">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex justify-center items-center p-4">
        <DialogPanel className="bg-white shadow p-6 rounded w-full max-w-md">
          <DialogTitle className="mb-4 font-bold text-lg">
            {initialData ? "Edit LiftType" : "Create LiftType"}
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="p-2 border rounded w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="rounded w-32 h-32 object-cover"
              />
            )}
            <input
              type="text"
              placeholder="Badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <textarea
              placeholder="Description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Features (comma separated)"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="p-2 border rounded w-full"
            >
              <option value="">Select Service</option>
              {services[0] && (
                <option key={services[0].id} value={services[0].id}>
                  {services[0].title}
                </option>
              )}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 px-4 py-2 rounded text-white"
              >
                {initialData ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
