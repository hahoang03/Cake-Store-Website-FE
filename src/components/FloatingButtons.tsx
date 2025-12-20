import { Facebook, Phone, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  return (
    <>
      <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook className="w-7 h-7" />
        </a>
        <a
          href="tel:+84123456789"
          className="w-14 h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
          aria-label="Phone"
        >
          <Phone className="w-7 h-7" />
        </a>
      </div>

      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
        <a
          href="https://zalo.me"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
          aria-label="Zalo"
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        </a>
        <button
          className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
          aria-label="Chat"
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      </div>
    </>
  );
}
