import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Nawi | Discreet Inquiries",
    description: "Connect with our design team for bespoke romantic experiences. We prioritize your privacy and discretion in every communication.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
