"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: { target: { name: any; value: any; }; }) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 space-y-8 relative">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="input-underline relative">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <span className="underline"></span>
        </div>

        <div className="input-underline relative">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <span className="underline"></span>
        </div>
      </div>

      <div className="input-underline relative">
        <textarea
          name="message"
          placeholder="Write your message"
          value={form.message}
          onChange={handleChange}
          className="h-30 pb-4 resize-none"
          required
        />
        <span className="underline"></span>
      </div>

      <button
        type="submit"
        className="px-8 py-3 rounded-md text-white transition-all duration-300 ease-in-out 
                   hover:opacity-90 hover:shadow-lg"
        style={{ backgroundColor: "var(--primary)" }}
      >
        Send Message
      </button>
    </form>
  );
}
