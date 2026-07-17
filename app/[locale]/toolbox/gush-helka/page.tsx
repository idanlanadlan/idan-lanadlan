import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import GushHelkaLookup from "@/components/tools/GushHelkaLookup";

export const metadata: Metadata = {
  title: "איתור גוש וחלקה לפי כתובת | עידן לנדל״ן",
  description:
    "מצאו גוש וחלקה לפי כתובת — או אתרו מיקום, שטח רשום וסטטוס לפי מספרי גוש וחלקה. נתונים רשמיים מהמרכז למיפוי ישראל (GovMap), בחינם וללא הרשמה.",
};

export default function GushHelkaPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="איתור גוש וחלקה"
        description="הקלידו כתובת וקבלו את מספרי הגוש והחלקה הרשומים, או הזינו גוש וחלקה ואתרו את המיקום, השטח הרשום וסטטוס הרישום — ישירות מנתוני המרכז למיפוי ישראל."
        disclaimer="הנתונים מוצגים כפי שהם ממערכות GovMap של המרכז למיפוי ישראל ואינם תחליף לנסח טאבו או לבדיקה משפטית. לצורך עסקה יש להסתמך על נסח רישום עדכני."
      >
        <GushHelkaLookup />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
