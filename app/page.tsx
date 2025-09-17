import Link from "next/link";

export default function Home() {

  const msAuthURL = `${process.env.NEXT_PUBLIC_MICROSOFT_OATH_URL}?client_id=${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:3000/ms/auth/callback')}&response_mode=query&scope=offline_access%20openid%20profile%20User.Read%20Mail.Read&state=12345`;

  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3000/google/auth/callback')}&scope=https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/userinfo.email&response_type=code&access_type=offline&prompt=consent`;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p>Outlook Auth URL: {msAuthURL}</p>
        <p>Google Auth URL: {googleAuthURL}</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href={msAuthURL}
          >
            Connect with MS Outlook
          </Link>
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href={googleAuthURL}
          >
            Connect with Google
          </Link>
        </div>
      </main>
    </div>
  );
}
