'use client';

export default function EmptyPost() {
  return (
    <section className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
      <div className="mb-5 flex min-h-[50vh] flex-col items-center justify-center p-5">
        <div className="w-full max-w-xs mx-auto mb-6">
          <svg viewBox="0 0 400 300" className="w-full h-auto text-gray-300">
            <rect x="50" y="100" width="300" height="150" fill="currentColor" rx="10" />
            <circle cx="120" cy="140" r="15" fill="white" />
            <circle cx="280" cy="140" r="15" fill="white" />
            <path d="M150 180 Q200 200 250 180" stroke="white" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold">Không tìm thấy tin đăng</h3>
        <p className="mt-2 w-3/4 text-center text-base text-foreground">
          Không tìm thấy tin đăng nào phù hợp với yêu cầu của bạn, hãy thử lại với khu vực, điều kiện khác.
        </p>
      </div>
    </section>
  );
}