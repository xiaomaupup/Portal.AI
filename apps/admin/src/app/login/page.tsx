"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "登录失败";
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@demo.local");
  const [password, setPassword] = useState("Admin12345!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
          const res = await adminLogin(email, password);
          localStorage.setItem("admin_token", res.accessToken);
          localStorage.setItem("admin_user", JSON.stringify(res.user));
          router.push("/posts");
        } catch (err: unknown) {
          setError(getErrorMessage(err));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <Label>邮箱</Label>
        <Input
          className="mt-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div>
        <Label>密码</Label>
        <Input
          className="mt-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "登录中…" : "登录"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-md px-6 py-12">
        <h1 className="text-2xl font-extrabold tracking-tight">管理员登录</h1>
        <p className="mt-2 text-sm text-slate-600">使用管理员账号访问内容管理系统</p>

        <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

