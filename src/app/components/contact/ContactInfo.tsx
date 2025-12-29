import { Mails, MapPinHouse, PhoneIncoming } from "lucide-react";

export default function ContactInfo() {
  return (
    <div
      className="relative p-10 text-white overflow-hidden"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <h2 className="text-2xl font-semibold mb-6">
        Contact Information
      </h2>

      <p className="text-sm opacity-90 mb-10">
        Fill up the form and our team will get back to you within 24 hours.
      </p>

      <ul className="space-y-6 text-sm">
        <li className="flex gap-3"><PhoneIncoming /> +880 1234 567 890</li>
        <li className="flex gap-3"><Mails /> support@yourdomain.com</li>
        <li className="flex gap-3"><MapPinHouse /> Dhaka, Bangladesh</li>
      </ul>

      {/* Decorative shape */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/15" />
      <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/20" />
    </div>
  );
}
