"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ContactModal from "./ContactModal";

const NAV = [
  { href: "/dashboard/posts",    label: "Mes posts",    icon: "✍️" },
  { href: "/dashboard/calendar", label: "Calendrier",   icon: "📅" },
  { href: "/dashboard/stats",    label: "Statistiques", icon: "📈" },
  { href: "/dashboard/news",     label: "Mes actus",    icon: "📬" },
];

interface SidebarProps {
  userName?: string;
  company?: string;
  isAdmin?: boolean;
}

export default function Sidebar({ userName, company, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [showContact, setShowContact] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
    <aside className="w-60 shrink-0 bg-white border-r border-border flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <img src="/logo.svg" alt="Phare" className="h-8" />
      </div>

      {/* Company info */}
      <div className="px-5 py-4 border-b border-border">
        <div className="text-xs font-semibold text-t3 uppercase tracking-widest mb-1">Espace client</div>
        <div className="text-sm font-semibold text-t1 truncate">{company || userName}</div>
        {company && <div className="text-xs text-t3 truncate">{userName}</div>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? "bg-accent-xl text-accent font-semibold"
                  : "text-t2 hover:bg-bg-2 hover:text-t1"
                }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-3 text-xs font-semibold text-t3 uppercase tracking-widest">Admin</div>
            <Link
              href="/admin/clients"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${pathname.startsWith("/admin/clients")
                  ? "bg-accent-xl text-accent font-semibold"
                  : "text-t2 hover:bg-bg-2 hover:text-t1"
                }`}
            >
              <span className="text-base">👥</span>
              Clients
            </Link>
            <Link
              href="/admin/deliver"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${pathname.startsWith("/admin/deliver")
                  ? "bg-accent-xl text-accent font-semibold"
                  : "text-t2 hover:bg-bg-2 hover:text-t1"
                }`}
            >
              <span className="text-base">📤</span>
              Livrer des posts
            </Link>
          </>
        )}
      </nav>

      {/* Contact */}
      <div className="px-3 pb-1">
        <button
          onClick={() => setShowContact(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-t2 hover:bg-bg-2 hover:text-t1 transition-colors"
        >
          <span className="text-base">💬</span>
          Contacter l'équipe
        </button>
      </div>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-t2 hover:bg-bg-2 hover:text-t1 transition-colors"
        >
          <span className="text-base">↩️</span>
          Se déconnecter
        </button>
      </div>

    </aside>

    {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
