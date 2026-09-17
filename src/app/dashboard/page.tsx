"use client";

import {
  AlarmClock,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Settings2,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "./page.module.css";

type AgendaType = "urgent" | "meeting" | "proposal";

type AgendaItem = {
  id: string;
  initial: string;
  name: string;
  company: string;
  status: "กำลังติดต่อ" | "รอติดตาม";
  time: string;
  urgent?: boolean;
  phone?: string;
  phoneHref?: string;
  line?: string;
  email?: string;
  note: string;
  type: AgendaType;
  record: DashboardContact;
};

type DashboardContact = {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string;
  channel: string;
  interest: string;
  status: "new" | "talking" | "closed";
  followUp: string;
  note: string;
};

function toAgendaItem(record: DashboardContact): AgendaItem {
  const followUp = new Date(record.followUp);
  const urgent = followUp.getTime() <= Date.now() + 24 * 60 * 60 * 1000;
  const line = record.channel.toLowerCase().includes("line")
    ? record.channel.replace(/^line:\s*/i, "")
    : undefined;

  return {
    id: record.id,
    initial: record.name.charAt(0),
    name: record.name,
    company: record.company,
    status: record.status === "talking" ? "กำลังติดต่อ" : "รอติดตาม",
    time: followUp.toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" }),
    urgent,
    phone: record.phone,
    phoneHref: record.phone.replace(/\D/g, ""),
    line,
    email: record.email ?? undefined,
    note: record.note,
    type: urgent ? "urgent" : record.status === "talking" ? "meeting" : "proposal",
    record,
  };
}

const logoUrl =
  "https://lh3.googleusercontent.com/aida/AEtjO1UdbsyCH6yWJVe0bsyeohAQHMgnmRJxj42rtBIRCd1lobNcWQ7pdGgQAnsbd459ErqYeyHSUmuhiVH4625K4Flqi3cy_mCpRB4rEDkFZehW6hXbMPw1rqQsnvPMMSUcUZAkL8kXXjq372t44RGJTxIHqzxibnCyURL7Cre717JPBlwokp4cooNKEQGvs73rfPls_acpwcJQjDgyNaqqHtHom7TQhpxPOcmkCuU92WKMcTC3Y7FAJPDU6Tc";

const profileUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBu2DbKY4DBfwB-D7u7DHrPykfHnG0GTcF926x6SC5A2P8ACs7ngEILlx3MCaaOa5aedEoVqydf1bn7I4-6JvjZdbPZ8M_oTcQBUUSauW7IZsYZ5a1p9fc8MKiz8sntFr4_TXBdm20u2wQ-U4GSJfkiw_0ANSPIsek51l1fiNIMcscfF73GlCxfiUMoP9InizTrBdhem8dREi0HiN4Q0M62PvQwpyVKI17WS4jr4usZpeM_n5kbWZdc";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [contacts, setContacts] = useState<DashboardContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | AgendaType>("all");
  const [ascending, setAscending] = useState(true);
  const [completed, setCompleted] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  useEffect(() => {
    let active = true;

    const loadContacts = async () => {
      const response = await fetch("/api/contacts");
      if (response.status === 401) {
        router.replace("/sign-in");
        return;
      }
      if (response.ok && active) {
        setContacts((await response.json()) as DashboardContact[]);
      }
      if (active) setLoading(false);
    };

    void loadContacts();
    return () => {
      active = false;
    };
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const agenda = contacts.filter((contact) => contact.status !== "closed").map(toAgendaItem);
  const visibleAgenda = agenda
    .filter((item) => activeFilter === "all" || item.type === activeFilter)
    .toSorted((a, b) => ascending
      ? a.record.followUp.localeCompare(b.record.followUp)
      : b.record.followUp.localeCompare(a.record.followUp));

  const markComplete = async (item: AgendaItem) => {
    const response = await fetch(`/api/contacts/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item.record, status: "closed" }),
    });
    if (!response.ok) {
      showToast("บันทึกสถานะไม่สำเร็จ กรุณาลองใหม่");
      return;
    }
    setCompleted((current) => current.includes(item.id) ? current : [...current, item.id]);
    setContacts((current) => current.map((contact) =>
      contact.id === item.id ? { ...contact, status: "closed" } : contact,
    ));
    showToast(`บันทึก ${item.name} เป็นเสร็จสิ้นแล้ว`);
  };

  const total = contacts.length;
  const countByStatus = (status: DashboardContact["status"]) =>
    contacts.filter((contact) => contact.status === status).length;
  const percentage = (value: number) => total ? Math.round((value / total) * 100) : 0;
  const urgentCount = agenda.filter((item) => item.type === "urgent").length;
  const completionRate = percentage(countByStatus("closed"));
  const dateText = new Intl.DateTimeFormat("th-TH", { dateStyle: "full" }).format(new Date());
  const metrics = [
    { label: "กำลังติดต่อ", value: countByStatus("talking"), detail: "ราย", tone: "contacting" },
    { label: "รอติดตาม", value: countByStatus("new"), detail: "ราย", tone: "pending" },
    { label: "สำเร็จแล้ว", value: countByStatus("closed"), detail: "ราย", tone: "success" },
    { label: "ยกเลิก / พักไว้", value: 0, detail: "ราย", tone: "cancelled" },
  ] as const;

  const signOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className={styles.appShell}>
      <header className={styles.topBar}>
        <div className={styles.barInner}>
          <div className={styles.brand}>
            <Image unoptimized src={logoUrl} width={72} height={32} alt="Follow-up Board" />
            <div><strong>Follow-up Board</strong><span>Dashboard</span></div>
          </div>
          <div className={styles.headerActions}>
            <button type="button" aria-label="การแจ้งเตือน"><Bell size={20} /><i /></button>
            <Image unoptimized src={profileUrl} width={32} height={32} alt="โปรไฟล์ผู้ใช้" />
            <button className={styles.logoutButton} type="button" onClick={signOut}>
              <LogOut size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.welcomeCard}>
          <div className={styles.welcomeTop}>
            <div>
              <h1>สวัสดี{session?.user.name ? `คุณ${session.user.name}` : ""} <span>👋</span></h1>
              <p><CalendarDays size={16} />{dateText}</p>
            </div>
            <div className={styles.urgentPill}><i />มี {urgentCount} งานด่วนวันนี้</div>
          </div>
          <div className={styles.insight}>
            <span><TrendingUp size={18} /></span>
            <p>คุณปิดการติดตามสำเร็จแล้ว <strong>{completionRate}%</strong> จากรายชื่อทั้งหมด ลุยต่ออีกนิด!</p>
          </div>
        </section>

        <div className={styles.dashboardGrid}>
          <section className={styles.pipeline}>
            <div className={styles.sectionHeading}><h2>ภาพรวมไปป์ไลน์</h2><span>ทั้งหมด {total} ราย</span></div>
            <div className={styles.metricGrid}>
              <div className={styles.todayMetric}>
                <div><p><AlarmClock size={18} />ต้องติดตามเร็วๆ นี้</p><strong>{agenda.length} <span>รายที่รอดำเนินการ</span></strong></div>
                <div><b>เร่งด่วน {urgentCount} ราย</b><span>ครบกำหนดภายใน 24 ชั่วโมง</span></div>
              </div>
              {metrics.map((metric) => (
                <article className={`${styles.metricCard} ${styles[metric.tone]}`} key={metric.label}>
                  <div><span>{metric.label}</span><i /></div>
                  <p><strong>{metric.value}</strong><span>{metric.detail}</span></p>
                  <div className={styles.progress}><i style={{ width: `${percentage(metric.value)}%` }} /></div>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.agendaSection}>
            <div className={styles.sectionHeading}>
              <div><h2>รายการที่ต้องติดตาม</h2><b>{agenda.length}</b></div>
              <button type="button" onClick={() => setAscending((current) => !current)}>เรียงตามเวลา <RefreshCw size={15} /></button>
            </div>
            <div className={styles.agendaFilters}>
              {[
                ["all", `ทั้งหมด (${agenda.length})`],
                ["urgent", `เร่งด่วน (${agenda.filter((item) => item.type === "urgent").length})`],
                ["meeting", `กำลังคุย (${agenda.filter((item) => item.type === "meeting").length})`],
                ["proposal", `รายการใหม่ (${agenda.filter((item) => item.type === "proposal").length})`],
              ].map(([value, label]) => (
                <button className={activeFilter === value ? styles.activeFilter : ""} type="button" key={value} onClick={() => setActiveFilter(value as "all" | AgendaType)}>{label}</button>
              ))}
            </div>
            <div className={styles.agendaList}>
              {visibleAgenda.map((item) => (
                <AgendaCard
                  key={item.id}
                  item={item}
                  complete={completed.includes(item.id)}
                  onComplete={() => markComplete(item)}
                  onToast={showToast}
                />
              ))}
              {!visibleAgenda.length && <p className={styles.emptyAgenda}>{loading ? "กำลังโหลดข้อมูล..." : "ไม่มีรายการในหมวดนี้"}</p>}
            </div>
          </section>
        </div>

        <section className={styles.activities}>
          <div className={styles.sectionHeading}><h2>ผู้ติดต่อล่าสุด</h2><span>เฉพาะบัญชีของคุณ</span></div>
          <div className={styles.activityList}>
            {contacts.slice(0, 2).map((contact) => (
              <article key={contact.id}><span><UserPlus size={17} /></span><div><div><strong>{contact.name}</strong></div><p>{contact.company} • สนใจ {contact.interest}</p></div></article>
            ))}
            {!contacts.length && <p className={styles.emptyAgenda}>{loading ? "กำลังโหลดข้อมูล..." : "ยังไม่มีข้อมูลผู้ติดต่อ"}</p>}
          </div>
        </section>

        <Link className={styles.viewContacts} href="/contacts">ดูรายชื่อผู้ติดต่อทั้งหมด ({total})<ArrowRight size={20} /></Link>
      </main>

      <nav className={styles.bottomNav} aria-label="เมนูหลัก">
        <div className={styles.barInner}>
          <Link className={styles.currentNav} href="/dashboard" aria-current="page"><LayoutDashboard size={23} /><span>แดชบอร์ด</span></Link>
          <Link href="/contacts"><Users size={23} /><span>รายชื่อ</span></Link>
          <button type="button" aria-label="เพิ่มผู้ติดต่อ" onClick={() => showToast("เปิดแบบฟอร์มสร้างรายชื่อใหม่")}><UserPlus size={23} /></button>
          <a href="#settings"><Settings2 size={23} /><span>การตั้งค่า</span></a>
        </div>
      </nav>

      {toast && <div className={styles.toast} role="status"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function AgendaCard({ item, complete, onComplete, onToast }: {
  item: AgendaItem;
  complete: boolean;
  onComplete: () => void;
  onToast: (message: string) => void;
}) {
  return (
    <article className={`${styles.agendaCard} ${styles[item.status === "กำลังติดต่อ" ? "inProgress" : "waiting"]}`}>
      <div className={styles.agendaIdentity}>
        <div className={styles.person}>
          <span>{item.initial}</span>
          <div><h3>{item.name}</h3><p>{item.company}</p></div>
        </div>
        <div className={styles.status}><i />{item.status}</div>
      </div>
      <div className={`${styles.channels} ${item.urgent ? styles.urgentTime : ""}`}>
        <span><Clock3 size={16} />{item.time}</span>
        {item.phone && <span><Phone size={16} />{item.phone}</span>}
        {item.line && <span><MessageCircle size={16} />{item.line}</span>}
        {item.email && <span><Mail size={16} />{item.email}</span>}
      </div>
      <p className={styles.agendaNote}><strong>โน้ต:</strong> {item.note}</p>
      <div className={styles.agendaActions}>
        <div>
          {item.phoneHref && <a href={`tel:${item.phoneHref}`}><Phone size={17} />โทรออก</a>}
          {item.line && <button type="button" onClick={() => onToast(`กำลังเปิด LINE: @${item.line}`)}><MessageCircle size={17} />LINE</button>}
          {item.email && <a href={`mailto:${item.email}`}><Mail size={17} />ส่งอีเมล</a>}
          <button type="button" aria-label="เลื่อนกำหนด" onClick={() => onToast(`เลื่อนกำหนด ${item.name}`)}><CalendarDays size={17} /></button>
        </div>
        <button className={complete ? styles.completedButton : styles.completeButton} type="button" onClick={onComplete}><Check size={17} />{complete ? "บันทึกแล้ว" : "เสร็จสิ้น"}</button>
      </div>
    </article>
  );
}
