import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../card/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result = await fetchUserPosts(accountId);

  if (!result) return redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((thread) => (
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUserId={currentUserId as string}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: result?.name as string,
                  image: result?.image as string,
                  id: result?.id as string,
                }
              : {
                  name: thread.author.name as string,
                  image: thread.author.image as string,
                  id: thread.author.id as string,
                }
          }
          createdAt={String(thread.createdAt)}
          comments={thread.children as { author: { image: string } }[]}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
