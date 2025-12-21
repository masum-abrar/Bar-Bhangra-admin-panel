"use client";
import { useState } from "react";

export default function ReplyModal({ isOpen, onClose, contact, onReplied }) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleReply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `https://bar-bhangra-backend.vercel.app/api/v1/contact/${contact.id}/reply`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyMessage }),
        }
      );

      if (!res.ok) throw new Error("Failed to send reply");

      const data = await res.json();
      onReplied(data.data); // ✅ matches parent
      setReplyMessage("");
      onClose();
    } catch (err) {
      console.error("Reply error:", err);
      alert("Error sending reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white shadow-md p-6 rounded w-96">
        <h2 className="mb-4 font-bold text-xl">
          Reply to {contact.name} ({contact.email})
        </h2>

        <form onSubmit={handleReply}>
          <textarea
            className="mb-3 p-2 border rounded w-full"
            rows="4"
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            required
          ></textarea>

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
              disabled={loading}
              className="bg-blue-500 px-4 py-2 rounded text-white"
            >
              {loading ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
