import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ToastProvider } from "@/components/ui";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col paper">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </ToastProvider>
    </I18nProvider>
  );
}
