"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { authClient } from "@/lib/auth-client";

import styles from "./auth-form.module.css";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);

    const result = isSignUp
      ? await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setPending(false);

    if (result.error) {
      setError(result.error.message || "ไม่สามารถดำเนินการได้ กรุณาลองใหม่");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className={styles.page}>
      <section className={styles.authCard}>
        <div className={styles.brandMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <header>
          <p>FOLLOW-UP BOARD</p>
          <h1>{isSignUp ? "สร้างบัญชีของคุณ" : "ยินดีต้อนรับกลับมา"}</h1>
          <span>
            {isSignUp
              ? "เริ่มจัดการรายชื่อและงานติดตามในที่เดียว"
              : "เข้าสู่ระบบเพื่อดูงานติดตามของคุณ"}
          </span>
        </header>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <label>
              ชื่อ
              <div className={styles.inputWrap}>
                <UserRound size={18} />
                <input
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="ชื่อที่ใช้ในระบบ"
                />
              </div>
            </label>
          )}
          <label>
            อีเมล
            <div className={styles.inputWrap}>
              <Mail size={18} />
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@company.com"
              />
            </div>
          </label>
          <label>
            รหัสผ่าน
            <div className={styles.inputWrap}>
              <LockKeyhole size={18} />
              <input
                required
                minLength={8}
                type={showPassword ? "text" : "password"}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <div className={styles.error} role="alert">{error}</div>}

          <button className={styles.submit} type="submit" disabled={pending}>
            {pending ? "กำลังดำเนินการ..." : isSignUp ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
            {!pending && <ArrowRight size={18} />}
          </button>
        </form>

        <footer>
          {isSignUp ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
            {isSignUp ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Link>
        </footer>
      </section>
      <aside className={styles.contextPanel}>
        <div>
          <span>วันนี้</span>
          <strong>6</strong>
          <p>งานติดตามที่รอคุณอยู่</p>
        </div>
        <blockquote>“ทุกบทสนทนาที่ดี เริ่มจากการติดตามที่ตรงเวลา”</blockquote>
      </aside>
    </main>
  );
}
