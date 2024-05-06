import Link from "next/link";

export default function Home() {

  return (
    <main className="p-4 pt-6">
      <h2 className="text-center text-2xl">Welcome to - Modern Diagnostic Center</h2>

      <div className="flex justify-center pt-4">
        <div className="flex">
          <Link href="/bill" className="border mx-2 flex rounded p-4 bg-teal-600 h-[150px] w-[150px] justify-center items-center">Create Bill</Link>
          <Link href="/dashboard" className="border mx-2 flex rounded p-4 bg-teal-600 h-[150px] w-[150px] justify-center items-center">Dashboar</Link>
        </div>
      </div>
    </main>
  );
}
