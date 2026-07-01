import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import PropertyMatchQuiz from "@/components/tools/PropertyMatchQuiz";

export const metadata: Metadata = {
  title: "שאלון התאמת נכס | עידן לנדל״ן",
  description: "3 שאלות קצרות שיעזרו לזהות את פרופיל הנכס שהכי מתאים לכם.",
};

export default function PropertyMatchPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="שאלון התאמת נכס"
        description="שלוש שאלות קצרות — וקבלו פרופיל נכס מותאם אישית."
      >
        <PropertyMatchQuiz />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
