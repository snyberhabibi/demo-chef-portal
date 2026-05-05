import Link from "next/link";

export function AuthLogo() {
  return (
    <div className="mb-8 text-center">
      <Link href="/" className="flex flex-col items-center justify-center gap-2">
        <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Chef Portal</p>
      </Link>
    </div>
  );
}

