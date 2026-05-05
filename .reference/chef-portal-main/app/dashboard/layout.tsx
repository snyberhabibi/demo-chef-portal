"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/dashboard/app-sidebar";
import {
  TopBar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ActionList,
  Avatar,
} from "@/components/polaris";
import { useAuth } from "@/components/providers";
import { useRouter } from "next/navigation";
import { PersonIcon, SettingsIcon, CreditCardIcon, ExitIcon } from "@shopify/polaris-icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try {
      await logout();
    } catch {
      router.push("/auth/login");
    }
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <TopBar
            navigation={
              <SidebarTrigger className="-ml-1" />
            }
            actions={
              user && (
                <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                  <PopoverTrigger asChild>
                    <button
                      className="flex items-center gap-[var(--p-space-200)] shrink-0 cursor-pointer rounded-[var(--p-border-radius-200)] p-[var(--p-space-100)] hover:bg-[var(--p-color-bg-fill-transparent-hover)] outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]"
                    >
                      <Avatar
                        source={user.avatar?.url || undefined}
                        name={user.name || "Chef"}
                        initials={user.name?.[0]?.toUpperCase()}
                        size="sm"
                      />
                      <span className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] hidden sm:block">
                        {user.name || "Chef"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    sideOffset={8}
                    className="w-[14rem] !p-0"
                  >
                    <div className="px-[var(--p-space-300)] py-[var(--p-space-300)] border-b border-[var(--p-color-border-secondary)]">
                      <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                        {user.name || "Chef"}
                      </p>
                      <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-025)]">
                        {user.email || ""}
                      </p>
                    </div>
                    <ActionList
                      sections={[
                        {
                          items: [
                            {
                              id: "profile",
                              label: "Profile",
                              icon: PersonIcon,
                              onClick: () => { setUserMenuOpen(false); router.push("/dashboard/profile"); },
                            },
                            {
                              id: "settings",
                              label: "Account Settings",
                              icon: SettingsIcon,
                              onClick: () => { setUserMenuOpen(false); router.push("/dashboard/account-settings"); },
                            },
                            {
                              id: "payment",
                              label: "Payment Methods",
                              icon: CreditCardIcon,
                              onClick: () => { setUserMenuOpen(false); router.push("/dashboard/payment-methods"); },
                            },
                          ],
                        },
                        {
                          items: [
                            {
                              id: "logout",
                              label: "Log out",
                              icon: ExitIcon,
                              destructive: true,
                              onClick: handleLogout,
                            },
                          ],
                        },
                      ]}
                    />
                  </PopoverContent>
                </Popover>
              )
            }
          />
          <main className="flex flex-1 flex-col gap-4 p-4 3xl:px-32 3xl:py-8">
            <div className="w-full max-w-[75rem] mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
