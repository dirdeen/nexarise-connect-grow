import { Link } from "@tanstack/react-router";
import logo_img from "/favicon.svg";
export function Logo({ variant = "default" }: { variant?: "default" | "light" }) {
  const textClass = variant === "light" ? "text-white" : "text-secondary";
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img src={logo_img} alt="image logo" className="h-9 w-9" />
      {/* <div className="relative h-9 w-9 rounded-xl bg-gradient-primary shadow-glow grid place-items-center transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20V6l8 6 8-6v14" />
        </svg>
      </div> */}
      <span className={`font-display text-xl font-bold tracking-tight ${textClass}`}>
        Nexa<span className="text-primary">Rise</span>
      </span>
    </Link>
  );
}
