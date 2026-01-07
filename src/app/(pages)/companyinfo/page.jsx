"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Save,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Sidebar from "@/app/components/Sidebar";

/* ================= SECTION COMPONENT ================= */
const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-2xl border bg-white p-6 shadow-sm">
    <h4 className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-800">
      <Icon className="h-4 w-4 text-emerald-600" /> {title}
    </h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const CompanyInfoPage = () => {
  const [company, setCompany] = useState({
    id: null,
    name: "",
    businessId: "",
    vat: "",
    address1: "",
    address2: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
    hours1: "",
    hours2: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= GET COMPANY INFO ================= */
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://bar-bhangra-backend.vercel.app/api/v1/company-info"
        );
        const data = await res.json();

        if (!data.success) throw new Error(data.message);
        if (data.data) setCompany(data.data);
      } catch (err) {
        toast.error(err.message || "Failed to load company info");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  /* ================= SAVE / UPDATE ================= */
  const handleSave = async () => {
    try {
      setSaving(true);

      const method = company.id ? "PUT" : "POST";
      const url = company.id
        ? `https://bar-bhangra-backend.vercel.app/api/v1/company-info/${company.id}`
        : "https://bar-bhangra-backend.vercel.app/api/v1/company-info";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setCompany(data.data);
      toast.success("Company information saved successfully");
    } catch (err) {
      toast.error(err.message || "Failed to save company info");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-64 border-r bg-white">
        <Sidebar />
      </div>

      <div className="flex-1 p-8">
        <Toaster position="top-right" />

        <Card className="mx-auto max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
          {/* HEADER */}
          <CardHeader className="border-b bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 px-8 py-6 text-white">
            <CardTitle className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                <Building2 className="h-5 w-5" />
              </div>
              Company Information
            </CardTitle>
            <p className="mt-1 max-w-xl text-sm text-emerald-100">
              Update and manage your official company contact & business details
            </p>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <>
                <Section icon={Building2} title="Basic Information">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        Company Name
                      </Label>
                      <Input
                        name="name"
                        value={company.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        Business ID
                      </Label>
                      <Input
                        name="businessId"
                        value={company.businessId}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        VAT Number
                      </Label>
                      <Input
                        name="vat"
                        value={company.vat}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </Section>

                <Section icon={MapPin} title="Address">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-gray-600">
                      Street Address
                    </Label>
                    <Input
                      name="address1"
                      value={company.address1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-gray-600">
                      City & Country
                    </Label>
                    <Input
                      name="address2"
                      value={company.address2}
                      onChange={handleChange}
                    />
                  </div>
                </Section>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <Section icon={Phone} title="Phone Numbers">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        Primary Phone
                      </Label>
                      <Input
                        name="phone1"
                        value={company.phone1}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        Secondary Phone
                      </Label>
                      <Input
                        name="phone2"
                        value={company.phone2}
                        onChange={handleChange}
                      />
                    </div>
                  </Section>

                  <Section icon={Mail} title="Email Addresses">
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        Primary Email
                      </Label>
                      <Input
                        name="email1"
                        value={company.email1}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-gray-600">
                        Secondary Email
                      </Label>
                      <Input
                        name="email2"
                        value={company.email2}
                        onChange={handleChange}
                      />
                    </div>
                  </Section>
                </div>

                <Section icon={Clock} title="Opening Hours">
                  <div className="space-y-1.5">
                    <Label className="text-sm text-gray-600">Weekdays</Label>
                    <Input
                      name="hours1"
                      value={company.hours1}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm text-gray-600">Weekend</Label>
                    <Input
                      name="hours2"
                      value={company.hours2}
                      onChange={handleChange}
                    />
                  </div>
                </Section>

                <div className="flex justify-end pt-6">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 rounded-xl px-8 py-5 text-sm font-semibold"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyInfoPage;
