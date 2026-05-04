"use client";

import { createPost } from "@/app/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";



const CreatePost = () => {
  const { user, isLoaded } = useUser(); //get user

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
   const [githubUrl, setGithubUrl] = useState("");
   const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState("");

  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [postType, setPostType] = useState<"POST" | "PROJECT">(
    "POST",
  );
    const [autoDetected, setAutoDetected] = useState(true);
  if (!isLoaded) return null;
  if (!user) return null;


const detectPostType = () => {
  const text = (title + " " + content).toLowerCase().trim();

  const hasLinks = githubUrl || liveUrl;

  const projectKeywords = [
    "project",
    "built",
    "created",
    "made",
    "developed",
    "app",
  ];

  const isProjectIntent = projectKeywords.some((word) => text.includes(word));

  if (hasLinks && isProjectIntent) return "PROJECT";

  if (hasLinks) return "PROJECT"; // fallback

  return "POST";
};

  // Auto detect (only if user hasn't manually changed)
  useEffect(() => {
    if (!autoDetected) return;
    setPostType(detectPostType());
  }, [title, content, githubUrl, liveUrl]);


  //server action
  const handleSubmit = async () => {
    if (!content.trim() && !image && !title.trim()) return;
    // console.log("My post image is here:", image);

    setIsPosting(true);
    try {
       const result = await createPost({
         title: title || (postType === "PROJECT" ? "Untitled Project" : ""),
         description: content,
         githubUrl: githubUrl || undefined,
         liveUrl: liveUrl || undefined,
         image: image || undefined,
         type: postType,
       });


      if (result.success) {
    setTitle("");
    setContent("");
    setGithubUrl("");
    setLiveUrl("");
    setImage("");
    setPostType("POST");
    setAutoDetected(true);
    setShowImageUpload(false);

        toast.success("Post created successfully");
      }
    } catch (error) {
      toast.error("Faild to create post");
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.imageUrl || "/avatar.png"} />
          </Avatar>

          <div className="text-sm font-medium">@{user?.fullName|| "user"}</div>
        </div>

        {/* TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title (e.g. Social Media App)"
          className="w-full border rounded-md px-3 py-2 text-sm"
          disabled={isPosting}
        />

        {/* DESCRIPTION */}
        <Textarea
          placeholder="Describe your project..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPosting}
        />

        {/* GITHUB + LIVE DEMO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="GitHub Repo URL"
            className="w-full border rounded-md px-3 py-2 text-sm"
            disabled={isPosting}
          />

          <input
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="Live Demo URL"
            className="w-full border rounded-md px-3 py-2 text-sm"
            disabled={isPosting}
          />
          
        </div>

        {/* image upload */}
        {showImageUpload && (
          <div className="border rounded-lg p-4 mt-4">
            <ImageUpload
              key={image || "empty"}
              endpoint="postImage"
              value={image}
              onChange={(url) => {
                setImage(url);
                if (!url) setShowImageUpload(false);
              }}
              setIsUploading={setIsUploading}
            />
          </div>
        )}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isPosting}
            >
              <ImageIcon className="size-4 mr-2" />
              Photo
            </Button>
          </div>
          <Button
            className="flex items-center"
            onClick={handleSubmit}
            disabled={
              (!content && !image && !title) || isPosting || isUploading
            }
          >
            {isPosting ? (
              <>
                <Loader2Icon className="size-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : isUploading ? (
              <>
                <Loader2Icon className="size-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <SendIcon className="size-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
