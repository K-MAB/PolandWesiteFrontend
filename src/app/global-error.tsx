"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-[#f6f8fb] font-sans text-[#172438]">
        <main className="px-6 text-center">
          <h1 className="text-2xl font-bold">A critical error occurred</h1>
          <p className="mt-2 text-sm text-[#64748b]">The application shell could not be loaded.</p>
          <button type="button" onClick={reset} className="mt-6 rounded-md bg-[#2457a7] px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </main>
      </body>
    </html>
  );
}
