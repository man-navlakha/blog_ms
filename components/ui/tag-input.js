"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

const TagInput = ({ value = [], onChange = () => {}, placeholder = "Type and press Enter to add tags..." }, ref) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const tags = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) {
        const newTag = input.trim().replace(/,$/, "");
        if (!tags.includes(newTag)) {
          onChange([...tags, newTag]);
        }
        setInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-border-color bg-background p-3 focus-within:ring-2 focus-within:ring-primary">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(tag)}
            className="hover:opacity-70"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 border-0 bg-transparent outline-none placeholder:text-muted-ink min-w-[100px]"
      />
    </div>
  );
};

TagInput.displayName = "TagInput";

export { TagInput };
