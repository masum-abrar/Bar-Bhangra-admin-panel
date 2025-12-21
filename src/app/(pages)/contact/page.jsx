"use client";
import { useState, useEffect } from "react";
import ContactModal from "./ContactModal";
import ReplyModal from "./ReplyModal";
import Sidebar from "@/app/components/Sidebar";

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        "https://bar-bhangra-backend.vercel.app/api/v1/bar-contact"
      );
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  // Slice contacts for current page
  const currentContacts = contacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 mx-auto p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-2xl">Contacts Information</h1>
          {/* <button
            className='bg-blue-500 px-4 py-2 rounded text-white'
            onClick={() => setShowModal(true)}
          >
            Add Contact
          </button> */}
        </div>
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  Message
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentContacts.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : ""
                  } hover:bg-green-50 transition-colors duration-300`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {c.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {c.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-[400px]">
                    <div className="max-h-24 overflow-y-auto">{c.message}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === i + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {showModal && (
          <ContactModal
            onClose={() => setShowModal(false)}
            onSubmit={handleCreate}
          />
        )}
        {showReplyModal && (
          <ReplyModal
            isOpen={showReplyModal}
            contact={selectedContact}
            onClose={() => setShowReplyModal(false)}
            onReplied={handleReplied}
          />
        )}
      </div>
    </div>
  );
}
