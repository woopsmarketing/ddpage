import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-neutral-500">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-4 max-w-md text-base text-neutral-600">
        요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다.
        주소를 다시 확인해 주세요.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
