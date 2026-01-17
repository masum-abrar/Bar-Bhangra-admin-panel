"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { FiBold, FiItalic, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import Sidebar from "@/app/components/Sidebar";
import toast, { Toaster } from "react-hot-toast";

const API = "https://bar-bhangra-backend.vercel.app/api/v1";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const [text, setText] = useState("");
  const [color, setColor] = useState("#111827");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
    fetchSetting();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await fetch(`${API}/admin/announcements`);
    const json = await res.json();
    if (json.success) setAnnouncements(json.data);
  };

  const fetchSetting = async () => {
    const res = await fetch(`${API}/announcement-setting`);
    const json = await res.json();
    if (json.success) setEnabled(json.data.isEnabled);
  };

  const resetForm = () => {
    setText("");
    setColor("#111827");
    setIsBold(false);
    setIsItalic(false);
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return toast.error("Text required");

    const payload = { text, color, isBold, isItalic };

    const res = await fetch(
      editId ? `${API}/announcements/${editId}` : `${API}/announcements`,
      {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const json = await res.json();
    if (!json.success) return toast.error(json.message);

    toast.success(editId ? "Updated" : "Created");
    setOpen(false);
    resetForm();
    fetchAnnouncements();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setText(item.text);
    setColor(item.color);
    setIsBold(item.isBold);
    setIsItalic(item.isItalic);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/announcements/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchAnnouncements();
  };

  /* ================= SWITCH ================= */
  const toggleSwitch = async (value) => {
    setEnabled(value);
    await fetch(`${API}/announcement-setting`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isEnabled: value }),
    });
    toast.success(value ? "Announcement ON" : "Announcement OFF");
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />

      <div className="w-64 border-r bg-white">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={resetForm}>
                <FiPlus /> Add Announcement
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Edit Announcement" : "New Announcement"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex gap-2">
                {/* <Button
                  size="icon"
                  variant={isBold ? "default" : "outline"}
                  onClick={() => setIsBold(!isBold)}
                >
                  <FiBold />
                </Button>
                <Button
                  size="icon"
                  variant={isItalic ? "default" : "outline"}
                  onClick={() => setIsItalic(!isItalic)}
                >
                  <FiItalic />
                </Button> */}

                <div className="flex items-center gap-2">
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-9"
                  />
                </div>
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write announcement"
              />

              <div className="border p-3 rounded-xl">
                <p
                  style={{
                    color,
                    fontWeight: isBold ? 700 : 400,
                    fontStyle: isItalic ? "italic" : "normal",
                  }}
                >
                  {text || "Live preview"}
                </p>
              </div>

              <Button onClick={handleSubmit}>
                {editId ? "Update" : "Create"}
              </Button>
            </DialogContent>
          </Dialog>

          {/* Global Switch */}
          <div className="flex items-center gap-3">
            <Label>Show on Website</Label>
            <Switch checked={enabled} onCheckedChange={toggleSwitch} />
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4">
          {announcements.map((item) => (
            <Card key={item.id} className="rounded-2xl">
              <CardContent className="flex justify-between p-4">
                <p
                  style={{
                    color: item.color,
                    fontWeight: item.isBold ? 700 : 400,
                    fontStyle: item.isItalic ? "italic" : "normal",
                  }}
                >
                  {item.text}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
