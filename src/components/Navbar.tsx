import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
      <Link href="/" className="text-xl font-black tracking-wider text-slate-900">
        INSTASK
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
