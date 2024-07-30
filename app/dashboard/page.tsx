import { redirect } from "next/navigation";

// app/page.tsx
export default function HomePage() {
    return (
      redirect("/dashboard/basic")
    );
  }