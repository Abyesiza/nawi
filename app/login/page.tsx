import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/current";
import { NawiLogo } from "@/components/nawi-logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect(
      user.role === "ADMIN"
        ? "/admin"
        : user.role === "AGENT"
        ? "/agent"
        : "/dashboard"
    );
  }
  const sp = await searchParams;

  async function action(formData: FormData) {
    "use server";
    const result = await loginAction(formData);
    if (result?.error) {
      redirect(`/login?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 flex flex-col items-center gap-6">
          <NawiLogo size="lg" showWordmark={false} variant="dark" asLink />
          <div>
            <h1 className="text-3xl font-bold text-grey-dark">
              Enter with Alias
            </h1>
            <p className="mt-3 text-grey-medium text-sm">
              Use the username and password from your identity card.
            </p>
          </div>
        </div>

        <form
          action={action}
          className="bg-white rounded-3xl border border-burgundy/5 shadow-xl p-8 space-y-6"
        >
          {sp.error && (
            <div className="bg-burgundy/5 border border-burgundy/20 text-burgundy text-sm rounded-xl px-4 py-3">
              {sp.error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="alias"
              className="block text-xs font-bold tracking-widest uppercase text-grey-medium"
            >
              Alias (Username)
            </label>
            <input
              id="alias"
              name="alias"
              type="text"
              required
              autoComplete="username"
              placeholder="e.g. VelvetRose_42"
              className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-bold tracking-widest uppercase text-grey-medium"
            >
              Password (Concierge Name)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all"
          >
            Sign In
          </button>

          <p className="text-center text-xs text-grey-medium pt-2">
            No account yet?{" "}
            <Link href="/booking" className="text-burgundy font-semibold">
              Begin a booking
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
