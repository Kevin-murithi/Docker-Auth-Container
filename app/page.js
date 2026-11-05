import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50 font-sans">
      <main className="w-full max-w-4xl px-6 py-16 sm:px-10">
        <header className="flex items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800">
              <Image
                src="/next.svg"
                alt="Logo"
                width={24}
                height={24}
                className="dark:invert"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Client Portal</p>
              <p className="text-sm font-medium text-slate-100">Admin & Client dashboards</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <Link
              href="/auth/login"
              className="rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-slate-100 px-4 py-2 text-slate-900 text-sm font-medium hover:bg-white transition-colors"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="grid gap-10 md:grid-cols-[minmax(0,1.25fr),minmax(0,0.9fr)] items-center">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-50">
              A single place for your clients and your team.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-slate-400 max-w-xl">
              Log in as an admin to manage users and settings, or sign in as a client to view your
              projects and updates. Authentication is handled securely via JWT and protected
              dashboard routes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full bg-slate-50 px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm hover:bg-white transition-colors"
              >
                Create an account
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 transition-colors"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950/80 p-5 shadow-xl">
            <p className="text-xs font-medium tracking-[0.16em] text-slate-400 mb-3 uppercase">
              Preview
            </p>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <span className="text-slate-400">When you sign in</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  Role-based redirect
                </span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Admins are redirected to the Admin dashboard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>Clients are redirected to the Client dashboard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>Unauthenticated visitors stay on this landing page or go to the auth screens.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
