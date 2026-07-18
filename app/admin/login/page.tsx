import { PasswordInput } from "@/components/admin/PasswordInput";
import { login } from "@/app/actions/login";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.5em] text-gold/80 uppercase mb-3">ניהול</p>
          <h1 className="font-display text-4xl font-light text-white">כניסה</h1>
          <p className="text-sm text-gray-light mt-2">עידן לנדל״ן</p>
        </div>

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gold tracking-wider uppercase mb-1.5">
              סיסמה
            </label>
            <PasswordInput />
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">סיסמה שגויה. נסה שוב.</p>
          )}

          <button
            type="submit"
            className="btn-gold w-full py-3 rounded-lg text-sm font-semibold mt-2"
          >
            כניסה לדשבורד
          </button>
        </form>

        <div className="flex justify-between items-center mt-6">
          <a href="/" className="text-xs text-gray-light hover:text-gold transition-colors">
            ← חזור לאתר
          </a>
          <a
            href="/admin/forgot-password"
            className="text-xs text-gray-light hover:text-gold transition-colors"
          >
            שכחתי סיסמה
          </a>
        </div>
      </div>
    </div>
  );
}
