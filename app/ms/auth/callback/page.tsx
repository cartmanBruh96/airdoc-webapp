'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

type Email = {
  id: string;
  subject: string;
  bodyPreview: string;
}

type Resp = {
  data: Array<Email>;
}

export default function Home() {

  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // generate client side uuid and verify with this state, ignore for now
  const [emails, setEmails] = React.useState<Array<Email>>([]);

  const initAuthHandler = async (code: string) => {
    const resp = await fetch('/api/ms/oauth/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    const data: Resp  = await resp.json();
    console.log('Response from auth init:', data.data);
    setEmails(data.data);
}

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <p>CODE: {code}</p>
        <p>STATE: {state}</p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          OAUTH Callback page
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => { initAuthHandler(code!) }}
          disabled={!code}
        >
          Initialize Auth
        </button>
        <div>
          <h2 className="text-lg font-semibold mb-4">Fetched Emails:</h2>
          {emails.length === 0 ? (
            <p>No emails fetched.</p>
          ) : (
            <ul className="space-y-4">
              {emails.map((email) => (
                <li key={email.id} className="border p-4 rounded shadow-sm">
                  <h3 className="font-bold">{email.subject}</h3>
                  <p>{email.bodyPreview}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
