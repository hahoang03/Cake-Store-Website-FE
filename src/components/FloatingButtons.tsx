import { Facebook, Phone, MessageCircle } from "lucide-react";

export default function FloatingButtons() {
  return (
    <>
      {/* BÊN TRÁI – ẨN MOBILE */}
      <div className="hidden md:fixed md:left-6 md:top-1/2 md:-translate-y-1/2 md:flex md:flex-col md:gap-4 md:z-40">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook className="w-7 h-7" />
        </a>

        <a
          href="tel:+84123456789"
          className="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Phone"
        >
          <Phone className="w-7 h-7" />
        </a>
      </div>

      {/* BÊN PHẢI – ẨN MOBILE */}
      <div className="hidden md:fixed md:right-6 md:top-1/2 md:-translate-y-1/2 md:flex md:flex-col md:gap-4 md:z-40">
        <a
          href="https://zalo.me"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Zalo"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          </svg>
        </a>

        <button
          className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
          aria-label="Chat"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>
    </>
  );
}
