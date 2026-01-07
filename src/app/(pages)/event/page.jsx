"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import Sidebar from "@/app/components/Sidebar";
import { toast, Toaster } from "react-hot-toast";
import API from "@/libs/api";

export default function EventAdmin() {
  const [popupEnabled, setPopupEnabled] = useState(false);

  // Fetch initial setting
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch(
          "https://bar-bhangra-backend.vercel.app/api/v1/settings/event-popup"
        );
        const data = await res.json();
        if (data.success) setPopupEnabled(data.enabled);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSetting();
  }, []);

  // Toggle switch
  const handleToggle = async (value) => {
    try {
      const promise = fetch(
        "https://bar-bhangra-backend.vercel.app/api/v1/settings/event-popup",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: value }),
        }
      ).then((res) => res.json());

      const data = await toast.promise(promise, {
        loading: value ? "Enabling event popup..." : "Disabling event popup...",
        success: value ? "Event popup enabled ✅" : "Event popup disabled ❌",
        error: "Failed to update popup setting",
      });

      if (data.success) {
        setPopupEnabled(data.enabled);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // return (
  //   <div className="flex justify-between items-center mb-6">
  //     <h1 className="text-3xl font-semibold">Manage Events</h1>

  //     {/* Global Switch */}
  //     <div className="flex items-center gap-3">
  //       <span>Show Event Popup</span>
  //       <Switch checked={popupEnabled} onCheckedChange={handleToggle} />
  //     </div>

  //     <Button
  //       className="bg-amber-600 hover:bg-amber-700"
  //       onClick={() => {
  //         setEditEvent(null);
  //         resetForm();
  //         setOpen(true);
  //       }}
  //     >
  //       <Plus className="w-4 h-4 mr-2" /> Add Event
  //     </Button>
  //   </div>
  // );
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    start: "",
    end: "",
    imageFile: null,
    specialMenu: "",
    plan: "",
  });

  // FETCH EVENTS
  const fetchEvents = async () => {
    try {
      const res = await API.get("/bar-events");
      setEvents(res.data.data); // assuming your jsonResponse wraps data in data
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      start: "",
      end: "",
      image: "",
      specialMenu: "",
      plan: "",
    });
  };

  // Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // PAGINATE EVENTS
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = events.slice(indexOfFirst, indexOfLast);

  // TOTAL PAGES
  const totalPages = Math.ceil(events.length / itemsPerPage);

  // CREATE/UPDATE EVENT
  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("date", form.date);
    formData.append("start", form.start);
    formData.append("end", form.end);

    // image file
    if (form.imageFile) {
      formData.append("image", form.imageFile);
    }

    // specialMenu as JSON string
    formData.append(
      "specialMenu",
      JSON.stringify(
        form.specialMenu
          ? form.specialMenu.split("\n").map((line) => {
              const [name, description, price] = line.split("|");
              return { name, description, price };
            })
          : []
      )
    );

    // plan as JSON string
    formData.append(
      "plan",
      JSON.stringify(form.plan ? form.plan.split("\n") : [])
    );

    try {
      if (editEvent) {
        await toast.promise(
          API.put(`/bar-events/${editEvent.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            loading: "Updating event...",
            success: "Event updated 🎉",
            error: "Failed to update event",
          }
        );
      } else {
        await toast.promise(
          API.post("/bar-events", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }),
          {
            loading: "Creating event...",
            success: "Event created 🎉",
            error: "Failed to create event",
          }
        );
      }

      fetchEvents();
      setOpen(false);
      setEditEvent(null);
      resetForm();
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  // EDIT EVENT
  const handleEdit = (ev) => {
    setEditEvent(ev);
    setForm({
      title: ev.title,
      date: ev.date.slice(0, 10),
      start: ev.start,
      end: ev.end,
      imageFile: null, // always null initially
      imageUrl: ev.imageUrl || "", // add this if you want preview
      specialMenu: ev.specialMenu
        ? ev.specialMenu
            .map((m) => `${m.name}|${m.description}|${m.price}`)
            .join("\n")
        : "",
      plan: ev.plan ? ev.plan.join("\n") : "",
    });
    setOpen(true);
  };

  // DELETE EVENT
  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;

    try {
      await toast.promise(API.delete(`/bar-events/${id}`), {
        loading: "Deleting...",
        success: "Event deleted",
        error: "Failed to delete",
      });
      fetchEvents();
    } catch (err) {}
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Manage Events</h1>

          {/* Global Switch */}
          <div className="flex items-center gap-3">
            <span>Show Event Popup</span>
            <Switch checked={popupEnabled} onCheckedChange={handleToggle} />
          </div>

          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => {
              setEditEvent(null);
              resetForm();
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>

        {/* Event List */}
        <div className="grid md:grid-cols-3 gap-6">
          {currentEvents.map((ev) => {
            // Parse specialMenu
            // Parse specialMenu safely
            let specialMenu = [];
            try {
              if (Array.isArray(ev.specialMenu)) {
                specialMenu = ev.specialMenu;
              } else if (typeof ev.specialMenu === "string") {
                specialMenu = JSON.parse(ev.specialMenu);
              }
            } catch {
              specialMenu = [];
            }

            // Parse plan
            let parsedPlan = [];
            try {
              if (Array.isArray(ev.plan)) {
                parsedPlan = ev.plan;
              } else if (typeof ev.plan === "string") {
                parsedPlan = JSON.parse(ev.plan);
              }
            } catch {
              parsedPlan = [];
            }

            return (
              <div
                key={ev.id}
                className="bg-white shadow-md rounded-xl p-4 border"
              >
                {/* IMAGE */}
                {ev.imageUrl && (
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                )}

                <h2 className="text-lg font-semibold mt-3">{ev.title}</h2>
                <p className="text-sm text-gray-600">
                  📅 {ev.date?.slice(0, 10)} | ⏰ {ev.start} - {ev.end}
                </p>

                {/* SPECIAL MENU UI */}
                {specialMenu.length > 0 && (
                  <div className="mt-3">
                    <h3 className="font-semibold text-amber-600">
                      🍽️ Special Menu
                    </h3>

                    <div className="mt-2 space-y-2">
                      {specialMenu.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border bg-amber-50/40 shadow-sm"
                        >
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-sm text-gray-600">
                            {m.description}
                          </p>
                          <p className="text-sm font-medium text-amber-700">
                            💰 {m.price}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EVENT PLAN UI */}
                {parsedPlan.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-semibold flex items-center gap-2 text-blue-600">
                      📋 Event Plan
                    </h3>

                    <ul className="mt-2 space-y-2">
                      {parsedPlan.map((p, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-lg border bg-blue-50/40 shadow-sm text-sm text-gray-800 flex items-start gap-2"
                        >
                          <span className="font-semibold text-blue-600">
                            {idx + 1}.
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEdit(ev)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(ev.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editEvent ? "Edit Event" : "Add Event"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Event Title"
              />
              <Input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  name="start"
                  value={form.start}
                  onChange={handleChange}
                />
                <Input
                  type="time"
                  name="end"
                  value={form.end}
                  onChange={handleChange}
                />
              </div>
              {/* IMAGE PREVIEW */}
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  className="w-40 h-40 object-cover mb-2 rounded"
                />
              )}

              {/* FILE INPUT */}
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, imageFile: e.target.files[0] })
                }
              />

              <Textarea
                name="specialMenu"
                value={form.specialMenu}
                onChange={handleChange}
                placeholder="Name | Description | Price (each line)"
              />
              <Textarea
                name="plan"
                value={form.plan}
                onChange={handleChange}
                placeholder="Event Plan (one per line)"
              />
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Save Event"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* PAGINATION */}
        <div className="flex justify-center mt-8 gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`${
                currentPage === index + 1
                  ? "bg-amber-600 text-white"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </Button>
          ))}

          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            Next
          </Button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
