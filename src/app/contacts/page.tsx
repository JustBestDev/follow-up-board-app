"use client";

import {
  AlarmClock,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  Clock3,
  FilePenLine,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  MessageCircle,
  MoreVertical,
  Pencil,
  Phone,
  Search,
  Settings2,
  SlidersHorizontal,
  StickyNote,
  Trash2,
  UserPlus,
  UserRoundSearch,
  Users,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "./page.module.css";

type Status = "new" | "talking" | "closed";

type Contact = {
  id: string;
  name: string;
  shortName: string;
  company: string;
  avatar?: string;
  status: Status;
  schedule: string;
  timing: string;
  timingTone?: "danger" | "success";
  note: string;
  phone: string;
  phoneHref: string;
  line?: string;
  email?: string;
  channel: string;
  interest: string;
  followUp: string;
  primaryAction: "call" | "email";
};

type ContactRecord = {
  id: string;
  name: string;
  company: string;
  email: string | null;
  phone: string;
  channel: string;
  interest: string;
  status: Status;
  followUp: string;
  note: string;
};

type ContactDraft = {
  name: string;
  company: string;
  email: string;
  phone: string;
  channel: string;
  interest: string;
  status: Status;
  followUp: string;
  note: string;
};

const emptyDraft: ContactDraft = {
  name: "",
  company: "",
  email: "",
  phone: "",
  channel: "",
  interest: "",
  status: "new",
  followUp: "",
  note: "",
};

const statusLabels: Record<Status, string> = {
  new: "รายการใหม่",
  talking: "กำลังคุย",
  closed: "ปิดงาน",
};

function presentContact(record: ContactRecord): Contact {
  const followUp = new Date(record.followUp);
  const line = record.channel.toLocaleLowerCase("th").includes("line")
    ? record.channel.replace(/^line:\s*/i, "")
    : undefined;

  return {
    ...record,
    shortName: record.name.split(" ")[0] || record.name,
    schedule: `ติดตาม: ${followUp.toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    })}`,
    timing: statusLabels[record.status],
    timingTone: record.status === "closed" ? "success" : undefined,
    phoneHref: record.phone.replace(/\D/g, ""),
    line,
    email: record.email || undefined,
    followUp: toDateTimeInput(followUp),
    primaryAction: record.email ? "email" : "call",
  };
}

function toDateTimeInput(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

const filterOptions: Array<{ value: "all" | Status; label: string }> = [
  { value: "all", label: "ทั้งหมด" },
  { value: "new", label: "รายการใหม่" },
  { value: "talking", label: "กำลังคุย" },
  { value: "closed", label: "ปิดงาน" },
];

const logoUrl =
  "https://lh3.googleusercontent.com/aida/AEtjO1UdbsyCH6yWJVe0bsyeohAQHMgnmRJxj42rtBIRCd1lobNcWQ7pdGgQAnsbd459ErqYeyHSUmuhiVH4625K4Flqi3cy_mCpRB4rEDkFZehW6hXbMPw1rqQsnvPMMSUcUZAkL8kXXjq372t44RGJTxIHqzxibnCyURL7Cre717JPBlwokp4cooNKEQGvs73rfPls_acpwcJQjDgyNaqqHtHom7TQhpxPOcmkCuU92WKMcTC3Y7FAJPDU6Tc";

const profileUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBu2DbKY4DBfwB-D7u7DHrPykfHnG0GTcF926x6SC5A2P8ACs7ngEILlx3MCaaOa5aedEoVqydf1bn7I4-6JvjZdbPZ8M_oTcQBUUSauW7IZsYZ5a1p9fc8MKiz8sntFr4_TXBdm20u2wQ-U4GSJfkiw_0ANSPIsek51l1fiNIMcscfF73GlCxfiUMoP9InizTrBdhem8dREi0HiN4Q0M62PvQwpyVKI17WS4jr4usZpeM_n5kbWZdc";

export default function Home() {
  const router = useRouter();
  const [contactItems, setContactItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | Status>("all");
  const [sortAscending, setSortAscending] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [quickLogContact, setQuickLogContact] = useState<Contact | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadContacts = async () => {
      const response = await fetch("/api/contacts");
      if (response.status === 401) {
        router.replace("/sign-in");
        return;
      }
      if (!response.ok) {
        if (active) setLoading(false);
        return;
      }

      const records = (await response.json()) as ContactRecord[];
      if (active) {
        setContactItems(records.map(presentContact));
        setLoading(false);
      }
    };

    void loadContacts();
    return () => {
      active = false;
    };
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  };

  const normalizedQuery = query.trim().toLocaleLowerCase("th");
  const visibleContacts = contactItems
    .filter((contact) => {
      const matchesFilter = activeFilter === "all" || contact.status === activeFilter;
      const haystack = [
        contact.name,
        contact.company,
        contact.phone,
        contact.channel,
        contact.email,
        contact.interest,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("th");
      return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
    })
    .toSorted((a, b) =>
      sortAscending
        ? a.followUp.localeCompare(b.followUp)
        : b.followUp.localeCompare(a.followUp),
    );

  const resetFilters = () => {
    setQuery("");
    setActiveFilter("all");
  };

  const openAddForm = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  };

  const openEditForm = (contact: Contact) => {
    setEditingId(contact.id);
    setDraft({
      name: contact.name,
      company: contact.company,
      email: contact.email ?? "",
      phone: contact.phone,
      channel: contact.channel,
      interest: contact.interest,
      status: contact.status,
      followUp: contact.followUp,
      note: contact.note,
    });
    setOpenMenu(null);
    setFormOpen(true);
  };

  const saveContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(editingId === null ? "/api/contacts" : `/api/contacts/${editingId}`, {
      method: editingId === null ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      showToast("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
      return;
    }

    const nextContact = presentContact((await response.json()) as ContactRecord);
    setContactItems((current) => editingId === null
      ? [nextContact, ...current]
      : current.map((contact) => (contact.id === editingId ? nextContact : contact)));
    setFormOpen(false);
    showToast(editingId === null ? "เพิ่มผู้ติดต่อเรียบร้อยแล้ว" : "บันทึกข้อมูลผู้ติดต่อแล้ว");
  };

  const deleteContact = async (contact: Contact) => {
    const response = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
    if (!response.ok) {
      showToast("ลบผู้ติดต่อไม่สำเร็จ กรุณาลองใหม่");
      return;
    }
    setContactItems((current) => current.filter((item) => item.id !== contact.id));
    setOpenMenu(null);
    showToast(`ลบรายการของ ${contact.shortName} แล้ว`);
  };

  const signOut = async () => {
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const filters = filterOptions.map((filter) => ({
    ...filter,
    count: filter.value === "all"
      ? contactItems.length
      : contactItems.filter((contact) => contact.status === filter.value).length,
  }));

  return (
    <div className={styles.appShell} onClick={() => setOpenMenu(null)}>
      <header className={styles.topBar}>
        <div className={styles.barInner}>
          <div className={styles.brand}>
            <Image unoptimized src={logoUrl} width={72} height={32} alt="Follow-up Board" />
            <div>
              <strong>Follow-up Board</strong>
              <span>Contacts</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconButton} type="button" aria-label="การแจ้งเตือน">
              <Bell size={20} />
              <span className={styles.notificationDot} />
            </button>
            <Image
              unoptimized
              className={styles.profile}
              src={profileUrl}
              width={32}
              height={32}
              alt="โปรไฟล์ผู้ใช้"
            />
            <button className={styles.logoutButton} type="button" onClick={signOut}>
              <LogOut size={18} />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.controls} aria-labelledby="contacts-title">
          <div className={styles.titleRow}>
            <div className={styles.titleGroup}>
              <h1 id="contacts-title">รายชื่อผู้ติดต่อ</h1>
              <span>({contactItems.length} คน)</span>
            </div>
            <button className={styles.filterButton} type="button">
              <SlidersHorizontal size={17} />
              ตัวกรอง
              <span />
            </button>
          </div>

          <label className={styles.searchBox}>
            <Search size={20} aria-hidden="true" />
            <span className={styles.srOnly}>ค้นหาผู้ติดต่อ</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล, บริษัท..."
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="ล้างคำค้นหา">
                <XCircle size={18} />
              </button>
            )}
          </label>

          <div className={styles.filterScroller}>
            {filters.map((filter) => (
              <button
                className={`${styles.filterChip} ${styles[filter.value]} ${
                  activeFilter === filter.value ? styles.activeChip : ""
                }`}
                type="button"
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.value !== "all" && <span className={styles.statusDot} />}
                {filter.label}
                <b>{filter.count}</b>
              </button>
            ))}
          </div>
        </section>

        <div className={styles.sortRow}>
          <div>
            <Clock3 size={16} />
            <span>เรียงตาม:</span>
            <button
              type="button"
              onClick={() => {
                setSortAscending((current) => !current);
                showToast(
                  `จัดเรียง: วันที่ติดตาม (${sortAscending ? "ไกลสุด" : "ใกล้สุด"})`,
                );
              }}
            >
              วันที่ติดตาม ({sortAscending ? "ใกล้สุด" : "ไกลสุด"})
              <ChevronDown size={14} />
            </button>
          </div>
          <span>แสดง {visibleContacts.length} จาก {contactItems.length} รายชื่อ</span>
        </div>

        {loading ? (
          <section className={styles.emptyState} aria-live="polite">
            <p>กำลังโหลดรายชื่อผู้ติดต่อ...</p>
          </section>
        ) : visibleContacts.length ? (
          <section className={styles.contactGrid} aria-label="รายการผู้ติดต่อ">
            {visibleContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                menuOpen={openMenu === contact.id}
                onMenuToggle={(event) => {
                  event.stopPropagation();
                  setOpenMenu((current) => (current === contact.id ? null : contact.id));
                }}
                onToast={showToast}
                onQuickLog={() => setQuickLogContact(contact)}
                onEdit={() => openEditForm(contact)}
                onDelete={() => deleteContact(contact)}
              />
            ))}
          </section>
        ) : (
          <section className={styles.emptyState}>
            <div><UserRoundSearch size={32} /></div>
            <h2>ไม่พบข้อมูลผู้ติดต่อ</h2>
            <p>ลองปรับเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองเพื่อดูข้อมูลทั้งหมด</p>
            <button type="button" onClick={resetFilters}>ล้างการค้นหา</button>
          </section>
        )}

        <div className={styles.floatingAction}>
          <button type="button" onClick={openAddForm}>
            <UserPlus size={21} />
            เพิ่มรายชื่อใหม่
          </button>
        </div>
      </main>

      <nav className={styles.bottomNav} aria-label="เมนูหลัก">
        <div className={styles.barInner}>
          <Link href="/dashboard"><LayoutDashboard size={23} /><span>แดชบอร์ด</span></Link>
          <Link className={styles.currentNav} href="/contacts" aria-current="page"><Users size={23} /><span>รายชื่อ</span></Link>
          <button type="button" aria-label="เพิ่มผู้ติดต่อ" onClick={openAddForm}><UserPlus size={23} /></button>
          <a href="#settings"><Settings2 size={23} /><span>การตั้งค่า</span></a>
        </div>
      </nav>

      {formOpen && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setFormOpen(false)}>
          <form
            className={`${styles.quickLogSheet} ${styles.contactFormSheet}`}
            onSubmit={saveContact}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>
                <span><UserPlus size={20} /></span>
                <div>
                  <h2>{editingId === null ? "เพิ่มผู้ติดต่อ" : "แก้ไขผู้ติดต่อ"}</h2>
                  <p>ข้อมูลจะถูกบันทึกในบัญชีของคุณเท่านั้น</p>
                </div>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="ปิด"><X size={20} /></button>
            </div>
            <div className={styles.formGrid}>
              <label>ชื่อ<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
              <label>บริษัทหรือองค์กร<input required value={draft.company} onChange={(event) => setDraft({ ...draft, company: event.target.value })} /></label>
              <label>อีเมล<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
              <label>เบอร์โทรศัพท์<input required value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
              <label>ช่องทางติดต่อ<input required placeholder="เช่น LINE: username" value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value })} /></label>
              <label>สิ่งที่สนใจ<input required value={draft.interest} onChange={(event) => setDraft({ ...draft, interest: event.target.value })} /></label>
              <label>สถานะ<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Status })}><option value="new">รายการใหม่</option><option value="talking">กำลังคุย</option><option value="closed">ปิดงาน</option></select></label>
              <label>วันที่ต้อง Follow-up<input required type="datetime-local" value={draft.followUp} onChange={(event) => setDraft({ ...draft, followUp: event.target.value })} /></label>
              <label className={styles.fullField}>หมายเหตุ<textarea required rows={3} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /></label>
            </div>
            <div className={styles.sheetActions}>
              <button type="button" onClick={() => setFormOpen(false)}>ยกเลิก</button>
              <button type="submit">{editingId === null ? "เพิ่มผู้ติดต่อ" : "บันทึกการแก้ไข"}</button>
            </div>
          </form>
        </div>
      )}

      {quickLogContact && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setQuickLogContact(null)}>
          <section
            className={styles.quickLogSheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-log-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.sheetHeader}>
              <div className={styles.sheetTitle}>
                <span><FilePenLine size={20} /></span>
                <div>
                  <h2 id="quick-log-title">บันทึกกิจกรรมด่วน</h2>
                  <p>บันทึกการคุยกับ {quickLogContact.shortName}</p>
                </div>
              </div>
              <button type="button" onClick={() => setQuickLogContact(null)} aria-label="ปิด"><X size={20} /></button>
            </div>
            <fieldset className={styles.outcomes}>
              <legend>ผลการติดต่อล่าสุด</legend>
              <div>
                {["รับสาย สนใจ", "ไม่รับสาย", "นัดหมายใหม่"].map((outcome) => (
                  <button
                    className={selectedOutcome === outcome ? styles.selectedOutcome : ""}
                    type="button"
                    key={outcome}
                    onClick={() => setSelectedOutcome(outcome)}
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className={styles.noteInput}>
              รายละเอียดเพิ่มเติม
              <textarea rows={3} placeholder="ระบุสิ่งที่คุย หรือสิ่งที่ต้องดำเนินการต่อ..." />
            </label>
            <div className={styles.sheetActions}>
              <button type="button" onClick={() => setQuickLogContact(null)}>ยกเลิก</button>
              <button
                type="button"
                onClick={() => {
                  setQuickLogContact(null);
                  setSelectedOutcome("");
                  showToast("บันทึกกิจกรรมเรียบร้อยแล้ว");
                }}
              >บันทึกผล</button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <div className={styles.toast} role="status">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}

function ContactCard({
  contact,
  menuOpen,
  onMenuToggle,
  onToast,
  onQuickLog,
  onEdit,
  onDelete,
}: {
  contact: Contact;
  menuOpen: boolean;
  onMenuToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onToast: (message: string) => void;
  onQuickLog: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const ScheduleIcon =
    contact.status === "closed" ? CircleCheck : contact.status === "talking" ? AlarmClock : CalendarDays;

  return (
    <article className={`${styles.contactCard} ${styles[contact.status]}`}>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <div className={styles.identity}>
            {contact.avatar ? (
              <Image unoptimized src={contact.avatar} width={44} height={44} alt="" />
            ) : (
              <span className={styles.avatarFallback}>{contact.name.charAt(0)}</span>
            )}
            <div><h2>{contact.name}</h2><p>{contact.company}</p></div>
          </div>
          <div className={styles.cardTools}>
            <span className={styles.statusBadge}><i />{statusLabels[contact.status]}</span>
            <div className={styles.menuWrap}>
              <button type="button" aria-label={`เมนู ${contact.name}`} onClick={onMenuToggle}><MoreVertical size={18} /></button>
              {menuOpen && (
                <div className={styles.cardMenu} onClick={(event) => event.stopPropagation()}>
                  <button type="button" onClick={onEdit}><Pencil size={16} />แก้ไขข้อมูล</button>
                  <button type="button" onClick={onDelete}><Trash2 size={16} />ลบรายชื่อ</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.scheduleBox}>
          <div><ScheduleIcon size={18} /><strong>{contact.schedule}</strong></div>
          <span className={contact.timingTone ? styles[contact.timingTone] : ""}>{contact.timing}</span>
        </div>
        <p className={styles.urgentDetail}>สนใจ: {contact.interest}</p>

        <div className={styles.note}><StickyNote size={16} /><p>“{contact.note}”</p></div>

        <div className={styles.contactDetails}>
          <span><Phone size={13} />{contact.phone}</span>
          <span><MessageCircle size={13} />{contact.channel}</span>
          {contact.email && <span><Mail size={13} />{contact.email}</span>}
        </div>
      </div>

      <div className={styles.quickActions}>
        {contact.primaryAction === "email" ? (
          <a className={styles.emailPrimary} href={`mailto:${contact.email}`}><Mail size={18} />ส่งอีเมล</a>
        ) : (
          <a className={styles.callPrimary} href={`tel:${contact.phoneHref}`}><Phone size={18} />โทรออก</a>
        )}
        {contact.line ? (
          <button className={styles.linePrimary} type="button" onClick={() => onToast(`กำลังเปิด LINE เพื่อทักหา: @${contact.line}`)}><MessageCircle size={18} />LINE แชท</button>
        ) : (
          <a href={`tel:${contact.phoneHref}`}><Phone size={18} />โทรศัพท์</a>
        )}
        <button className={styles.logButton} type="button" onClick={onQuickLog} aria-label={`บันทึกกิจกรรม ${contact.name}`}><ListChecks size={18} /></button>
      </div>
    </article>
  );
}
