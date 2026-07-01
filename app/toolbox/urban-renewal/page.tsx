import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import UrbanRenewalEligibility from "@/components/tools/UrbanRenewalEligibility";

export const metadata: Metadata = {
  title: "בדיקת זכאות התחדשות עירונית | עידן לנדל״ן",
  description: "בדיקה ראשונית אינדיקטיבית לזכאות תמ״א 38 ופינוי-בינוי לפי כתובת ושנת בנייה.",
};

export default function UrbanRenewalPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="בדיקת זכאות התחדשות עירונית"
        description="הזינו את כתובת הבניין ושנת הבנייה לקבלת אינדיקציה ראשונית לגבי תמ״א 38 ופינוי-בינוי."
      >
        <UrbanRenewalEligibility />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
