import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import InspectionChecklist from "@/components/tools/InspectionChecklist";

export const metadata: Metadata = {
  title: "צ'קליסט בדק בית | עידן לנדל״ן",
  description: "צ'קליסט אינטראקטיבי לבדיקת נכס לפני רכישה — סדקים, רטיבות, אינסטלציה וחשמל.",
};

export default function InspectionChecklistPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="צ'קליסט בדק בית"
        description="לפני שסוגרים על נכס — עברו על הרשימה הזו בביקור. מה שמצאתם, נסביר לכם עליו לעומק במדריך המלא."
      >
        <InspectionChecklist />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
