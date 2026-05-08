"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, FileText, Rocket } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const CreateDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* MAIN BUTTON */}
      <Button
        variant="outline"
        className="flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 h-9 sm:h-10 cursor-pointer text-sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Plus className="w-4 h-4" />
        <span>Create</span>
      </Button>

      {/* DROPDOWN */}
      <div
        className={`absolute right-0 mt-2 w-52 sm:w-56 rounded-xl border bg-background shadow-lg z-50
    transition-all duration-200 ease-out origin-top-right
    ${
      open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
    }`}
      >
        <div className="p-2">
          <Link
            href="/create?type=post"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition"
            onClick={() => setOpen(false)}
          >
            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="text-sm font-medium">Create Post</span>
          </Link>

          <Link
            href="/create?type=project"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition"
            onClick={() => setOpen(false)}
          >
            <Rocket className="w-4 h-4 text-purple-500 shrink-0" />
            <span className="text-sm font-medium">Upload Project</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateDropdown;
