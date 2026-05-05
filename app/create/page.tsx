import CreatePost from "@/components/CreatePost";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;

  const type = params.type === "project" ? "PROJECT" : "POST";

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePost initialType={type} />
    </div>
  );
}
