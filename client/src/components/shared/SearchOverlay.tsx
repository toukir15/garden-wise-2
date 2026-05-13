"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { IoClose, IoSearchSharp } from "react-icons/io5";
import { IPostProviderValues, PostContext } from "@/src/context/post.provider";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { postStates } = useContext(PostContext) as IPostProviderValues;
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setValue(postStates.searchTerm || "");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSearch = () => {
    postStates.setSearchTerm(value.trim());
    router.push("/");
    onClose();
  };

  const handleClear = () => {
    setValue("");
    postStates.setSearchTerm("");
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]" onClick={onClose}>
      {/* Search bar — centered vertically at ~25% */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-4"
        style={{ top: "20%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 focus-within:border-green-500 rounded-full px-4 py-3 shadow-2xl transition-colors duration-150">
          <IoSearchSharp className="text-gray-400 text-xl shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search posts…"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-500"
          />
          {value ? (
            <button
              onClick={handleClear}
              className="text-gray-500 hover:text-white transition-colors shrink-0"
            >
              <IoClose className="text-lg" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors shrink-0"
            >
              <IoClose className="text-lg" />
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-3 select-none">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 text-xs font-mono">
            Enter
          </kbd>{" "}
          to search &nbsp;·&nbsp;{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 text-xs font-mono">
            Esc
          </kbd>{" "}
          to close
        </p>
      </div>
    </div>
  );
}
