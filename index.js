"use client";

import { useState, useEffect } from "react";

// =============================================================
// TYPES
// =============================================================

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

interface AgendaEvent {
  id: string;
  title: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}

interface QuestionBank {
  id: string;
  class: string;
  academic_year: string;
  subject: string;
  file_url: string;
  views: number;
  created_at: string;
}

interface AcademicCalendar {
  id: string;
  semester: string;
  start_date: string;
  end_date: string;
  description: string;
}

// =============================================================
// MOCK DATA
// =============================================================

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Jadwal Ujian Akhir Semester Genap 1446 H",
    content:
      "Ujian Akhir Semester Genap akan dilaksanakan mulai tanggal 10 Juni 2025. Seluruh pelajar wajib mempersiapkan diri dengan baik.",
    author: "Ustadz Ahmad Fauzi",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Libur Akhir Semester – Kembali ke Mahad",
    content:
      "Pelajar diharapkan kembali ke mahad paling lambat pada tanggal 30 Juni 2025 pukul 17.00 WIB untuk memulai tahun ajaran baru.",
    author: "Sekretariat HPIM",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Penyerahan Tugas Akhir Mata Kuliah Tsaqofah",
    content:
      "Pengumpulan makalah akhir Tsaqofah Islamiyyah dilakukan secara digital melalui portal paling lambat 5 Juni 2025.",
    author: "Ustadz Ridwan Hakim",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const AGENDA_EVENTS: AgendaEvent[] = [
  {
    id: "1",
    title: "Ujian Nahwu – Kelas 2 I'dadi",
    location: "Aula Utama Al-Azhar",
    start_date: "2025-06-12",
    end_date: "2025-06-12",
    description: "Ujian tulis mata pelajaran Nahwu semester genap.",
  },
  {
    id: "2",
    title: "Liqo' Bulanan HPIM Mesir",
    location: "Wisma Nusantara, Hay 10",
    start_date: "2025-06-15",
    end_date: "2025-06-15",
    description: "Pertemuan rutin bulanan seluruh mahad Indonesia di Mesir.",
  },
  {
    id: "3",
    title: "Seminar Moderasi Islam",
    location: "Gedung Serbaguna KBRI Kairo",
    start_date: "2025-06-20",
    end_date: "2025-06-20",
    description: "Seminar tentang Islam Wasathiyah dan peran pemuda.",
  },
];

const QUESTION_BANKS: QuestionBank[] = [
  {
    id: "1",
    class: "Kelas 3 Tsanawi",
    academic_year: "2024/2025",
    subject: "Balaghah",
    file_url: "#",
    views: 847,
    created_at: "2025-01-10",
  },
  {
    id: "2",
    class: "Kelas 2 I'dadi",
    academic_year: "2024/2025",
    subject: "Nahwu",
    file_url: "#",
    views: 612,
    created_at: "2025-01-08",
  },
  {
    id: "3",
    class: "Kelas 1 Tsanawi",
    academic_year: "2023/2024",
    subject: "Fiqih",
    file_url: "#",
    views: 503,
    created_at: "2024-12-20",
  },
];

const ACADEMIC_CALENDAR: AcademicCalendar = {
  id: "1",
  semester: "Genap 1446 H",
  start_date: "2025-01-15",
  end_date: "2025-07-31",
  description: "Semester Genap Tahun Akademik 1446–1447 H / 2025",
};

const SIDEBAR_MENUS = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "informasi", label: "Informasi", icon: "ℹ️" },
  { id: "akademik", label: "Akademik", icon: "📚" },
  { id: "bank-soal", label: "Bank Soal", icon: "📝" },
  { id: "jadwal", label: "Jadwal", icon: "🗓️" },
  { id: "kalender", label: "Kalender Akademik", icon: "📅" },
  { id: "administrasi", label: "Administrasi", icon: "🗂️" },
  { id: "organisasi", label: "Organisasi", icon: "🏛️" },
  { id: "pengaturan", label: "Pengaturan", icon: "⚙️" },
];

// =============================================================
// UTILS
// =============================================================

function isNew(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() < 24 * 60 * 60 * 1000;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getMonthAbbr(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", { month: "short" });
}

function getDay(dateStr: string): number {
  return new Date(dateStr).getDate();
}

function getSemesterProgress(calendar: AcademicCalendar): number {
  const start = new Date(calendar.start_date).getTime();
  const end = new Date(calendar.end_date).getTime();
  const now = Date.now();
  const progress = ((now - start) / (end - start)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

// =============================================================
// COMPONENTS
// =============================================================

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#D8F3DC",
        color: "#1B4332",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function Badge({ label, color = "green" }: { label: string; color?: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    green: { bg: "#D8F3DC", text: "#1B4332" },
    blue: { bg: "#DBEAFE", text: "#1E3A5F" },
    amber: { bg: "#FEF9C3", text: "#713F12" },
  };
  const c = colors[color] || colors.green;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 99,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E9ECEF",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "#D8F3DC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#6C757D", marginBottom: 4 }}>
          {label}
        </div>
        <div
          style={{ fontSize: 26, fontWeight: 700, color: "#1B4332", lineHeight: 1 }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function AnnouncementItem({ item }: { item: Announcement }) {
  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid #F1F3F5",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#212529",
            flex: 1,
            minWidth: 0,
          }}
        >
          {item.title}
        </span>
        {isNew(item.created_at) && <Badge label="Baru" />}
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#6C757D",
          margin: 0,
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.content}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 4,
        }}
      >
        <Avatar name={item.author} size={24} />
        <span style={{ fontSize: 12, color: "#6C757D" }}>{item.author}</span>
        <span style={{ fontSize: 12, color: "#ADB5BD", marginLeft: "auto" }}>
          {formatDate(item.created_at)}
        </span>
      </div>
    </div>
  );
}

function AgendaItem({ item }: { item: AgendaEvent }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid #F1F3F5",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 52,
          borderRadius: 12,
          background: "#0F2E22",
          color: "#fff",
          textAlign: "center",
          padding: "8px 4px",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase" }}>
          {getMonthAbbr(item.start_date)}
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
          {getDay(item.start_date)}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#212529" }}>
          {item.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#6C757D",
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          📍 {item.location}
        </div>
      </div>
    </div>
  );
}

function QuestionBankCard({ item }: { item: QuestionBank }) {
  return (
    <div
      className="zoom-card"
      style={{
        background: "#fff",
        border: "1px solid #E9ECEF",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "transform 0.15s, border-color 0.15s",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "#FFF3CD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          width: "max-content"
        }}
      >
        📄
      </div>
      <div>
        <div
          style={{ fontSize: 14, fontWeight: 700, color: "#212529", marginBottom: 2 }}
        >
          {item.subject}
        </div>
        <div style={{ fontSize: 12, color: "#6C757D" }}>
          {item.class} · {item.academic_year}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          color: "#52B788",
          fontWeight: 600,
          marginTop: "auto",
        }}
      >
        👁️ {item.views.toLocaleString("id-ID")} views
      </div>
    </div>
  );
}

function QuickAccessCard({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div
      className="quick-access-card"
      style={{
        background: "#fff",
        border: "1px solid #E9ECEF",
        borderRadius: 16,
        padding: "20px 16px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#212529" }}>
        {label}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E9ECEF",
        borderRadius: 20,
        padding: "24px",
        boxShadow: "0 4px 20px -4px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1B4332",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {action && (
          <span
            style={{
              fontSize: 12,
              color: "#52B788",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {action} →
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// =============================================================
// MAIN DASHBOARD
// =============================================================

export default function MahadiansDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mencegah selisih render server-side (Hydration Match)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const progress = getSemesterProgress(ACADEMIC_CALENDAR);
  const userName = "Muhammad Jiung";

  return (
    <div
      style={{
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif",
        background: "#F4F6F4",
        minHeight: "100vh",
        display: "flex",
      }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
          className="lg-hidden"
        />
      )}

      <aside
        className={`app-sidebar ${isMounted && sidebarOpen ? "sidebar-open" : ""}`}
        style={{
          width: 260,
          background: "#0F2E22",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          padding: "0 0 24px",
          overflowY: "auto",
          transition: "transform 0.25s ease-in-out",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "28px 24px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#52B788",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🕌
            </div>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: -0.5,
                }}
              >
                Mahadian's
              </div>
              <div style={{ fontSize: 11, color: "#52B788", marginTop: 1 }}>
                Portal Pelajar Ma'had
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {SIDEBAR_MENUS.map((menu) => {
            const isActive = activeMenu === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => {
                  setActiveMenu(menu.id);
                  setSidebarOpen(false);
                }}
                className={`nav-item-btn ${isActive ? "active" : ""}`}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 2,
                  fontSize: 14,
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {menu.icon}
                </span>
                {menu.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            margin: "0 12px",
            padding: "14px 16px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar name={userName} size={36} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </div>
            <div style={{ fontSize: 11, color: "#52B788" }}>Pelajar Mahad</div>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────────────── */}
      <div
        className="main-area-wrapper"
        style={{
          marginLeft: 260,
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.25s ease",
        }}
      >
        {/* ── TOPBAR ─────────────────────────────── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            background: "rgba(244,246,244,0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid #E9ECEF",
            padding: "12px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              color: "#1B4332",
              display: "none",
              padding: 4,
            }}
            className="mobile-hamburger"
            aria-label="Buka menu"
          >
            ☰
          </button>

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1B4332",
              textTransform: "capitalize",
              letterSpacing: -0.3,
            }}
          >
            {SIDEBAR_MENUS.find((m) => m.id === activeMenu)?.label ?? "Dashboard"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Notification */}
            <button
              style={{
                background: "#fff",
                border: "1px solid #E9ECEF",
                borderRadius: 12,
                width: 40,
                height: 40,
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
              aria-label="Notifikasi"
            >
              🔔
              <span
                style={{
                  position: "absolute",
                  top: 7,
                  right: 8,
                  width: 8,
                  height: 8,
                  background: "#E74C3C",
                  borderRadius: "50%",
                  border: "2px solid #F4F6F4",
                }}
              />
            </button>

            {/* Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="md-profile-text" style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#212529" }}>
                  {userName}
                </div>
                <div style={{ fontSize: 11, color: "#6C757D" }}>
                  Pelajar Mahad
                </div>
              </div>
              <Avatar name={userName} size={40} />
            </div>
          </div>
        </header>

        {/* ── CONTENT ────────────────────────────── */}
        <main style={{ padding: "28px 28px 48px", flex: 1 }}>
          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#1B4332",
                margin: 0,
                letterSpacing: -0.8,
              }}
            >
              Assalamu'alaikum, {userName.split(" ")[0]} 👋
            </h1>
            <p style={{ fontSize: 15, color: "#6C757D", margin: "6px 0 0" }}>
              Selamat datang di Mahadian's — portal pelajar Ma'had Al-Azhar
            </p>
          </div>

          {/* Stat Cards */}
          <div className="responsive-grid-4">
            <StatCard icon="🎓" label="Pelajar Aktif" value="248" />
            <StatCard icon="📝" label="Bank Soal" value="156" />
            <StatCard icon="📅" label="Agenda Hari Ini" value="3" />
            <StatCard icon="📢" label="Pengumuman" value="7" />
          </div>

          {/* Main Grid */}
          <div className="responsive-grid-2">
            {/* Pengumuman */}
            <SectionCard title="Pengumuman Terbaru" action="Lihat semua">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {ANNOUNCEMENTS.map((a) => (
                  <AnnouncementItem key={a.id} item={a} />
                ))}
              </div>
            </SectionCard>

            {/* Agenda */}
            <SectionCard title="Agenda Terdekat" action="Lihat semua">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {AGENDA_EVENTS.map((e) => (
                  <AgendaItem key={e.id} item={e} />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Quick Access */}
          <div style={{ marginBottom: 20 }}>
            <SectionCard title="Akses Cepat">
              <div className="quick-access-grid">
                <QuickAccessCard icon="📝" label="Bank Soal" />
                <QuickAccessCard icon="📅" label="Kalender Akademik" />
                <QuickAccessCard icon="📋" label="Formulir" />
                <QuickAccessCard icon="🗂️" label="Arsip Dokumen" />
              </div>
            </SectionCard>
          </div>

          {/* Bank Soal + Kalender grid */}
          <div className="responsive-grid-2">
            {/* Bank Soal Populer */}
            <SectionCard title="Bank Soal Terpopuler" action="Lihat semua">
              <div className="bank-soal-grid">
                {QUESTION_BANKS.map((q) => (
                  <QuestionBankCard key={q.id} item={q} />
                ))}
              </div>
            </SectionCard>

            {/* Kalender Akademik */}
            <SectionCard title="Kalender Akademik">
              <div style={{ marginTop: 8 }}>
                {/* Semester badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#1B4332",
                      }}
                    >
                      Semester {ACADEMIC_CALENDAR.semester}
                    </div>
                    <div style={{ fontSize: 12, color: "#6C757D", marginTop: 4 }}>
                      {ACADEMIC_CALENDAR.description}
                    </div>
                  </div>
                  <Badge label="Aktif" />
                </div>

                {/* Date range */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#6C757D",
                    marginBottom: 10,
                  }}
                >
                  <span>
                    🗓️ {formatDate(ACADEMIC_CALENDAR.start_date)}
                  </span>
                  <span>
                    🏁 {formatDate(ACADEMIC_CALENDAR.end_date)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    background: "#E9ECEF",
                    borderRadius: 99,
                    height: 10,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #2D6A4F, #52B788)",
                      borderRadius: 99,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#52B788",
                    fontWeight: 600,
                    textAlign: "right",
                  }}
                >
                  {progress}% berjalan
                </div>

                {/* Info tambahan dengan sintaks objek string yang valid */}
                <div
                  style={{
                    marginTop: 20,
                    padding: "14px 16px",
                    background: "#F8F9FA",
                    borderRadius: 12,
                    fontSize: 13,
                    color: "#6C757D",
                    lineHeight: 1.7,
                    borderLeft: "3px solid #52B788",
                  }}
                >
                  📌 Ujian Akhir Semester dijadwalkan mulai{" "}
                  <strong style={{ color: "#1B4332" }}>10 Juni 2025</strong>.
                  Harap mempersiapkan diri dengan mengakses Bank Soal.
                </div>
              </div>
            </SectionCard>
          </div>
        </main>
      </div>

      {/* ── RESPONSIVE STYLES ───────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Base utility styles button sidebar */
        .nav-item-btn {
          background: transparent;
          color: rgba(255,255,255,0.65);
          font-weight: 500;
        }
        .nav-item-btn:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #fff !important;
        }
        .nav-item-btn.active {
          background: rgba(82,183,136,0.15) !important;
          color: #52B788 !important;
          font-weight: 700 !important;
        }

        /* Micro-interactions */
        .zoom-card:hover {
          transform: translateY(-3px) !important;
          border-color: #52B788 !important;
        }
        .quick-access-card:hover {
          transform: scale(1.04) !important;
          border-color: #52B788 !important;
        }

        /* Responsive Layout Utilities */
        .responsive-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .responsive-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 8px;
        }

        .bank-soal-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 8px;
        }

        /* Breakpoints */
        @media (max-width: 1024px) {
          .mobile-hamburger { display: flex !important; }
          .main-area-wrapper { margin-left: 0 !important; }
          .app-sidebar { transform: translateX(-100%) !important; }
          .sidebar-open { transform: translateX(0) !important; }
          .lg-hidden { display: block !important; }
        }

        @media (max-width: 768px) {
          .responsive-grid-2 { grid-template-columns: 1fr !important; }
          .quick-access-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .bank-soal-grid { grid-template-columns: 1fr !important; }
          .md-profile-text { display: none !important; }
        }
      `}</style>
    </div>
  );
}