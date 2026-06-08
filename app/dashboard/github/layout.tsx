"use client";


export default function GithubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">GitHub Profile Manager</h1>
          <p className="text-gray-400 text-sm">Optimize your profile, manage repositories, and view insights.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}
