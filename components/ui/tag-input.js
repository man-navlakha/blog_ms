"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
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
    <div className="glass-input flex flex-wrap gap-2 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="clay-pill flex items-center gap-2 px-3 py-1 text-sm text-foreground"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(tag)}
            className="opacity-70 transition-opacity hover:opacity-100"
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
        className="min-w-[120px] flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-muted-ink"
      />
    </div>
  );
};

TagInput.displayName = "TagInput";

export { TagInput };
