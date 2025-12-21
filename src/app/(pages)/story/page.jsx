"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast, Toaster } from "react-hot-toast";
import API from "@/libs/api"; // axios instance
import dynamic from "next/dynamic";

// Client-only Rich Editor
const RichEditor = dynamic(() => import("@/components/ui/RichEditor"), {
  ssr: false,
});

export default function HistoryAdmin() {
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  // Fetch histories
  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/history");
      setHistories(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch history sections");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({ title: "", description: "", image: "" });
    setEditing(null);
  };

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save (Add / Edit)
  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast.error("Title and Description are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);

    if (form.imageFile) {
      fd.append("image", form.imageFile); // file object from input
    }

    setLoading(true);

    try {
      if (editing) {
        await toast.promise(
          API.put(`/history/${editing.id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            loading: "Updating...",
            success: "History updated 🎉",
            error: "Failed to update",
          }
        );
      } else {
        await toast.promise(
          API.post("/history", fd, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            loading: "Creating...",
            success: "History created 🎉",
            error: "Failed to create",
          }
        );
      }

      setOpen(false);
      resetForm();
      fetchHistories();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleEdit = (h) => {
    setEditing(h);
    setForm({
      title: h.title,
      description: h.description,
      imageFile: null, // no new file yet
      preview: h.imageUrl || "", // show existing image
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this history section?")) return;

    try {
      await toast.promise(API.delete(`/history/${id}`), {
        loading: "Deleting...",
        success: "Deleted 🎉",
        error: "Failed to delete",
      });
      fetchHistories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <Toaster position="top-right" />
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">History Sections</h1>
          <Button onClick={() => setOpen(true)}>Add History</Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : histories.length === 0 ? (
          <p>No history sections found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {histories.map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.title}</TableCell>
                  <TableCell>
                    <div
                      className="line-clamp-3 w-[400px]"
                      dangerouslySetInnerHTML={{ __html: h.description }}
                    />
                  </TableCell>
                  <TableCell>
                    {h.imageUrl ? (
                      <img
                        src={h.imageUrl}
                        alt={h.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button size="sm" onClick={() => handleEdit(h)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(h.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Dialog Add/Edit */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger />
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit History" : "Add History"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Description</Label>
                <RichEditor
                  value={form.description}
                  onChange={(val) => setForm({ ...form, description: val })}
                />
              </div>
              <div>
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setForm({ ...form, imageFile: file });

                      // Optional preview
                      setForm((prev) => ({
                        ...prev,
                        preview: URL.createObjectURL(file),
                      }));
                    }
                  }}
                />

                {/* Image Preview */}
                {form.preview && (
                  <img src={form.preview} className="w-24 h-24" />
                )}
              </div>

              <Button onClick={handleSave} disabled={loading}>
                {editing ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
