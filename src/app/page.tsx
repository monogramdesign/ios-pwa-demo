import Register from "@/components/register";
import { cookies } from "next/headers";
import Registered from "@/components/registered";

export default async function Home() {
  const subId = (await cookies()).get("subId")?.value;

  return (
    <main className="flex space-y-4 flex-col items-center justify-center min-h-dvh p-12">
      {subId ? <Registered subId={subId} /> : <Register />}
    </main>
  );
}
