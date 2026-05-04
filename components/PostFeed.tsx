"use client";

import { useState } from "react";
import PostCard from "./PostCard";
import { Button } from "./ui/button";
import { getPosts } from "@/app/actions/post.action";


type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[0] & {
  techStack?: string[];
  githubUrl?: string;
  liveUrl?: string;
  title?: string;
  description?: string;
  type?: "POST" | "PROJECT" | "QUESTION";
};  


export default function PostsFeed({
  posts,
  dbUserId,
}: {
  posts: Post;
  dbUserId: string | null;
    }) {
    
    
    const [filter, setFilter] = useState("ALL");
    

const filteredPosts = posts.filter((post) => {
  if (filter === "ALL") return true;
  return post.type === filter;
});

  return (
    <div>
      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-4">
        <Button onClick={() => setFilter("ALL")}>All</Button>
        <Button onClick={() => setFilter("PROJECT")}>Projects</Button>
        <Button onClick={() => setFilter("POST")}>Posts</Button>
        <Button onClick={() => setFilter("QUESTION")}>Questions</Button>
      </div>

      {/* POSTS */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} dbUserId={dbUserId} />
        ))}
      </div>
    </div>
  );
}
