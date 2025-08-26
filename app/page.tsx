import Link from "next/link";

export default function Home() {
  const authUrl = `${process.env.NEXT_PUBLIC_MICROSOFT_OATH_URL}?client_id=${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:3000/ms/auth/callback')}&response_mode=query&scope=offline_access%20openid%20profile%20User.Read%20Mail.Read&state=12345`;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p>{authUrl}</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href={authUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect to Outlook
          </Link>
        </div>
      </main>
    </div>
  );
}
