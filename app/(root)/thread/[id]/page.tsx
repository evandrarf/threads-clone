import ThreadCard from "@/components/card/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();

  if (!user) return redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) return redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  if (!thread) return redirect("/");
  console.dir(thread);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread.id}
          id={thread.id}
          currentUserId={user?.id as string}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author as { name: string; id: string; image: string }}
          createdAt={String(thread.createdAt)}
          comments={thread.children as { author: { image: string } }[]}
        />
      </div>
      <div className="mt-7 ">
        <Comment
          threadId={thread.id}
          currentUserImage={userInfo?.image as string}
          currentUserId={userInfo?.id as string}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((child: any) => (
          <ThreadCard
            key={child.id}
            id={child.id}
            currentUserId={user?.id as string}
            parentId={child.parentId}
            content={child.text}
            author={child.author as { name: string; id: string; image: string }}
            createdAt={String(child.createdAt)}
            comments={child.children as { author: { image: string } }[]}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
