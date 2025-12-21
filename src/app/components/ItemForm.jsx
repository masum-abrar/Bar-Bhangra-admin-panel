"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ItemForm() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const submit = async () => {
    const formData = new FormData();
    formData.append("name", "Carlsberg");
    formData.append("categoryId", 1);
    formData.append("image", file);

    setLoading(true);
    const res = await fetch("/api/menu/item", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    data.success ? toast.success(data.message) : toast.error(data.message);
  };

  return (
    <div className="border p-4 rounded-lg space-y-3">
      <h2 className="font-semibold">Create Menu Item</h2>
      <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button loading={loading} onClick={submit}>
        Create Item
      </Button>
    </div>
  );
}
