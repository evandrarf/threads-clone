import ThreadCard from "@/components/card/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";
import { useState } from "react";

export default async function Home() {
  const result = await fetchPosts({ pageSize: 20, cursor: null });

  const user = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.length === 0 ? (
          <p className="no-result">No Threads found</p>
        ) : (
          <>
            {result.map((post) => (
              <ThreadCard
                key={post.id}
                id={post.id}
                currentUserId={user?.id as string}
                parentId={post.parentId}
                content={post.text}
                author={
                  post.author as { name: string; id: string; image: string }
                }
                createdAt={String(post.createdAt)}
                comments={post.children as { author: { image: string } }[]}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
