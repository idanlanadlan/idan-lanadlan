import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import ManagementQuote from "@/components/tools/ManagementQuote";

export const metadata: Metadata = {
  title: "הצעת מחיר ניהול פרימיום | עידן לנדל״ן",
  description: "אמדו את דמי הניהול החודשיים לנכס יוקרה לפי סוג הנכס, שטח ורמת שירות.",
};

export default function ManagementQuotePage() {
  return (
    <>
      <Header />
      <ToolShell
        title="הצעת מחיר ניהול פרימיום"
        description="מחשבון לבעלי נכסי יוקרה — אמדו את דמי הניהול החודשיים לפי סוג הנכס ורמת השירות הרצויה."
        disclaimer="אומדן להמחשה בלבד. הצעת מחיר סופית ניתנת לאחר סקירת הנכס."
      >
        <ManagementQuote />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
