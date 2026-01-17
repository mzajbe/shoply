"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: string;
  type: string;
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 1. Load media from localStorage on initial mount
  useEffect(() => {
    const savedMedia = localStorage.getItem("shoply_media_library");
    if (savedMedia) {
      setMedia(JSON.parse(savedMedia));
    } else {
      // Default placeholder data if library is empty
      const defaultMedia: MediaItem[] = [
        { id: "1", name: "hero-banner.jpg", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", size: "1.2 MB", type: "image/jpeg" },
        { id: "2", name: "logo-dark.png", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30", size: "450 KB", type: "image/png" },
        { id: "3", name: "summer-collection.webp", url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b", size: "890 KB", type: "image/webp" },
      ];
      setMedia(defaultMedia);
      localStorage.setItem("shoply_media_library", JSON.stringify(defaultMedia));
    }
  }, []);

  // 2. Helper function to update state and sync with localStorage
  const syncMedia = (newMedia: MediaItem[]) => {
    setMedia(newMedia);
    localStorage.setItem("shoply_media_library", JSON.stringify(newMedia));
  };

  // Simulate an image upload
  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newItem: MediaItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: `upload-${Date.now()}.jpg`,
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        size: "1.5 MB",
        type: "image/jpeg",
      };
      syncMedia([newItem, ...media]);
      setIsUploading(false);
    }, 1000);
  };

  const deleteItem = (id: string) => {
    const updatedMedia = media.filter((item) => item.id !== id);
    syncMedia(updatedMedia);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Media Library</h1>
          <p className="text-slate-500 mt-1 text-lg">
            Manage your store's images and brand assets in one place.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/ahmed-dashboard/theme/editor" 
            className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            🎨 Back to Editor
          </Link>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 transition-all disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "📤 Upload New"}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {media.map((item) => (
          <div key={item.id} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Image Preview */}
            <div className="aspect-square overflow-hidden bg-slate-100">
              <img 
                src={item.url} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(item.url);
                  alert("URL Copied!");
                }}
                className="p-2 bg-white rounded-lg text-slate-900 hover:bg-orange-50 hover:text-orange-600 transition"
                title="Copy URL"
              >
                🔗
              </button>
              <button 
                onClick={() => deleteItem(item.id)}
                className="p-2 bg-white rounded-lg text-slate-900 hover:bg-red-50 hover:text-red-600 transition"
                title="Delete"
              >
                🗑️
              </button>
            </div>

            {/* Item Info */}
            <div className="p-3">
              <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{item.size} • {item.type.split('/')[1]}</p>
            </div>
          </div>
        ))}

        {media.length === 0 && !isUploading && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-slate-400">Your media library is empty. Upload your first image!</p>
          </div>
        )}
      </div>

      {/* Usage Tip */}
      <div className="mt-16 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
        <span className="text-xl">💡</span>
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>Tip:</strong> Images saved here are automatically available in your <strong>Theme Editor</strong>. Use the copy button to get direct links for your custom sections.
        </p>
      </div>
    </div>
  );
}