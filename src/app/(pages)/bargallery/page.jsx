"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SliderAdminPage() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    preview: null,
  });

  const slidesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://bar-bhangra-backend.vercel.app/api/v1/slider"
      );
      const data = await res.json();
      if (data.success) setSlides(data.data);
      else toast.error("Failed to fetch slides");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await fetch(
        `
https://bar-bhangra-backend.vercel.app/api/v1/slider/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Slide deleted successfully");
        fetchSlides();
      } else toast.error(data.message || "Failed to delete slide");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error("Please provide title and image");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("image", formData.image);

    try {
      setIsSubmitting(true);
      const res = await fetch(
        "https://bar-bhangra-backend.vercel.app/api/v1/slider",
        {
          method: "POST",
          body: form,
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Slide created successfully");
        setShowAddModal(false);
        setFormData({ title: "", image: null, preview: null });
        fetchSlides();
      } else toast.error(data.message || "Failed to create slide");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSlide = (slide) => {
    setSelectedSlide(slide);
    setFormData({ title: slide.title, image: null, preview: slide.image });
    setShowEditModal(true);
  };

  const handleUpdateSlide = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    if (formData.image) form.append("image", formData.image);

    try {
      setIsSubmitting(true);
      const res = await fetch(
        `
https://bar-bhangra-backend.vercel.app/api/v1/slider/${selectedSlide.id}`,
        { method: "PUT", body: form }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Slide updated successfully");
        setShowEditModal(false);
        setSelectedSlide(null);
        setFormData({ title: "", image: null, preview: null });
        fetchSlides();
      } else toast.error(data.message || "Failed to update slide");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination
  const indexOfLast = currentPage * slidesPerPage;
  const indexOfFirst = indexOfLast - slidesPerPage;
  const currentSlides = slides.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(slides.length / slidesPerPage);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gallery Management</h1>
          <Button onClick={() => setShowAddModal(true)}>Add New Gallery</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="loader border-4 border-t-4 border-gray-200 border-t-red-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Image</TableHead>

                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSlides.map((slide) => (
                  <TableRow key={slide.id}>
                    <TableCell>{slide.title}</TableCell>
                    <TableCell>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSlide(slide)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(slide.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <span>
                  Page {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add Slide Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Slide</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddSlide} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                      preview: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                  required
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt="preview"
                    className="mt-2 w-48 h-32 object-cover rounded"
                  />
                )}
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Create Slide
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ title: "", image: null, preview: null });
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Slide Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Slide</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleUpdateSlide} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files[0],
                      preview: URL.createObjectURL(e.target.files[0]),
                    })
                  }
                />
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt="preview"
                    className="mt-2 w-48 h-32 object-cover rounded"
                  />
                )}
                <p className="text-gray-400 text-sm mt-1">
                  Leave empty to keep existing image
                </p>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Update Slide
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSlide(null);
                    setFormData({ title: "", image: null, preview: null });
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
