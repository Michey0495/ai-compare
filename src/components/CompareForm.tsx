"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CompareForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ itemA: "", itemB: "", context: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemA.trim() || !form.itemB.trim()) {
      toast.error("比較する2つの項目を入力してください");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "エラーが発生しました");
        return;
      }
      router.push(`/result/${data.id}`);
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="itemA" className="block text-sm font-medium text-white/70">
            比較対象 A
          </label>
          <input
            id="itemA"
            type="text"
            value={form.itemA}
            onChange={(e) => setForm({ ...form, itemA: e.target.value })}
            placeholder="例: iPhone"
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="itemB" className="block text-sm font-medium text-white/70">
            比較対象 B
          </label>
          <input
            id="itemB"
            type="text"
            value={form.itemB}
            onChange={(e) => setForm({ ...form, itemB: e.target.value })}
            placeholder="例: Android"
            maxLength={100}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="text-white/20 text-2xl font-bold">VS</div>
      </div>

      <div className="space-y-2">
        <label htmlFor="context" className="block text-sm font-medium text-white/70">
          比較の観点（任意）
        </label>
        <input
          id="context"
          type="text"
          value={form.context}
          onChange={(e) => setForm({ ...form, context: e.target.value })}
          placeholder="例: コスパ重視で比較してほしい"
          maxLength={200}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-transparent transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-rose-500 text-white font-bold text-lg rounded-xl hover:bg-rose-400 hover:scale-[1.02] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? "AIが比較中..." : "AIで比較する"}
      </button>
    </form>
  );
}
