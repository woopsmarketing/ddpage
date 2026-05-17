type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <h1 className="text-2xl font-semibold">Portfolio: {slug}</h1>
    </main>
  );
}
