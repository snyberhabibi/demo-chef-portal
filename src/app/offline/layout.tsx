export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream px-6">
      {children}
    </div>
  );
}
