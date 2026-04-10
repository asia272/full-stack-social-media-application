"use client";

import {  X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (value) {
    return (
      <div className="relative w-40 h-40">
        <img
          src={value}
          className="w-40 h-40 object-cover rounded-md"
        />

        <Button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-0 right-0 px-2"
          variant="destructive"
        >
           <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Choose Image"}
      </Button>
    </div>
  );
}