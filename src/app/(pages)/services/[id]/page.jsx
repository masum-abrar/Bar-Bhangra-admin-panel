"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/libs/api";
import { FiArrowLeft } from "react-icons/fi";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (!service)
    return (
      <div className="p-6 text-center text-gray-500">Service not found</div>
    );

  return (
    <div className="mx-auto p-6 max-w-7xl">
      {/* Back Button */}
      <button
        onClick={() => router.push("/services")}
        className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:text-blue-800 transition"
      >
        <FiArrowLeft /> Back to Services
      </button>

      {/* Service Info */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          {service.title}
        </h1>
        <p className="text-gray-500 italic mb-5">Slug: {service.slug}</p>
        <p className="text-gray-700 mb-3">
          <strong>Short Description:</strong> {service.shortDescription}
        </p>
        <p className="text-gray-600">
          <strong>Full Description:</strong> {service.fullDescription}
        </p>
      </div>

      {/* Lift Types */}
      {service.liftTypes?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Lift Types</h2>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {service.liftTypes.map((lift) => {
              const imageUrl = `https://bar-bhangra-backend.vercel.app/${lift.image
                .replace(/^src[\\/]/, "")
                .replace(/\\/g, "/")}`;

              return (
                <div
                  key={lift.id}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  {/* Title & Badge */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {lift.title}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white text-xs font-semibold shadow">
                      {lift.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-3">
                    {lift.description}
                  </p>

                  {/* Features */}
                  {lift.feature?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-gray-800 font-semibold text-sm mb-1">
                        Features:
                      </h4>
                      <ul className="list-disc ml-5 text-gray-700 text-sm">
                        {lift.feature.map((feat, idx) => (
                          <li key={idx}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Image */}
                  <div className="mt-auto overflow-hidden rounded-xl shadow-md">
                    <img
                      src={imageUrl}
                      alt={lift.title}
                      className="w-full h-44 object-cover transform transition duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailsPage;
