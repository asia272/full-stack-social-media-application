"use client";

import { createPost } from "@/app/actions/post.action";
import { TECH_SUGGESTIONS } from "@/data/TechSuggestions";
import { useUser } from "@clerk/nextjs";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type PostType = "POST" | "PROJECT";

const CreatePost = ({ initialType }: { initialType?: PostType }) => {
  const { user, isLoaded } = useUser(); //get user

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);

  const [isPosting, setIsPosting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [mode, setMode] = useState<PostType>(initialType || "POST");
  const [postType, setPostType] = useState<PostType>(initialType || "POST");

  const techBoxRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [filteredTechs, setFilteredTechs] = useState<string[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!isLoaded) return null;
  if (!user) return null;
  // Set post type
  useEffect(() => {
    if (initialType) {
      setMode(initialType);
      setPostType(initialType);
    }
  }, [initialType]);
  // handle outside click on suggestion
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        techBoxRef.current &&
        !techBoxRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filtered = TECH_SUGGESTIONS.filter(
      (t) =>
        t.toLowerCase().includes(techInput.toLowerCase()) &&
        !techStack.includes(t),
    );

    setFilteredTechs(filtered);
    setHighlightIndex(-1);
  }, [techInput, techStack]);
  useEffect(() => {
    setHighlightIndex(-1);
  }, [techInput]);

  useEffect(() => {
    itemRefs.current = [];
  }, [filteredTechs]);
  useEffect(() => {
    if (highlightIndex < 0) return;

    const el = itemRefs.current[highlightIndex];

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightIndex]);
  const addTech = (tech: string) => {
    const value = tech.trim();

    if (!value) return;

    // max limit
    if (techStack.length >= 10) {
      toast.error("Max 10 technologies allowed");
      return;
    }

    // prevent duplicates
    if (techStack.includes(value)) {
      toast.error("Already added");
      return;
    }

    setTechStack((prev) => [...prev, value]);
  };
  const removeTech = (tech: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tech));
  };

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
        techStack: postType === "PROJECT" ? techStack : [],
      });

      if (result.success) {
        setTitle("");
        setContent("");
        setGithubUrl("");
        setLiveUrl("");
        setImage("");
        setShowImageUpload(false);
        setTechStack([]);
        setTechInput("");

        setPostType(initialType || "POST");
        setMode(initialType || "POST");
        toast.success("Post created successfully");
      }
    } catch (error) {
      toast.error("Faild to create post");
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6 ">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.imageUrl || "/avatar.png"} />
            </Avatar>

            <div className="text-sm font-medium">
              @{user?.fullName || "user"}
            </div>
          </div>

          {/* TITLE */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              mode === "PROJECT"
                ? "Project title (e.g. Social Media App)"
                : "What's on your mind?"
            }
            className="w-full border rounded-md px-3 py-2 text-sm"
            disabled={isPosting}
          />
          {/* DESCRIPTION */}
          <Textarea
            placeholder={
              mode === "PROJECT"
                ? "Describe your project..."
                : "Share your thoughts..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
          />

          {/* GITHUB + LIVE DEMO */}
          {mode === "PROJECT" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="mt-3 space-y-2 p-3 rounded-lg border bg-muted/30">
                {/* Input */}
                <div className="relative">
                  <Input
                    value={techInput}
                    onChange={(e) => {
                      setTechInput(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Add tech (React, Next.js...)"
                    className="
    w-full
    rounded-lg
    border
    bg-background
    px-3 py-2
    text-sm
    outline-none
    transition
    focus:ring-2
    focus:ring-primary/30
    focus:border-primary
  "
                    onKeyDown={(e) => {
                      if (!showDropdown) return;

                      // DOWN
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setHighlightIndex((prev) =>
                          prev < filteredTechs.length - 1 ? prev + 1 : 0,
                        );
                      }

                      // UP
                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setHighlightIndex((prev) =>
                          prev > 0 ? prev - 1 : filteredTechs.length - 1,
                        );
                      }

                      // ENTER
                      if (e.key === "Enter") {
                        e.preventDefault();

                        if (highlightIndex >= 0) {
                          addTech(filteredTechs[highlightIndex]);
                        } else if (filteredTechs.length > 0) {
                          addTech(filteredTechs[0]);
                        }

                        setShowDropdown(false);
                      }

                      // ESC
                      if (e.key === "Escape") {
                        setShowDropdown(false);
                      }
                    }}
                  />

                  {/* AUTOCOMPLETE DROPDOWN */}
                  {showDropdown && techInput.trim() && (
                    <div ref={techBoxRef} className="relative">
                      <div
                        className="
      absolute z-10 mt-2 w-full
      rounded-xl border
      bg-background/95 backdrop-blur-md
      shadow-xl
      max-h-48 overflow-auto
      animate-in fade-in-0 zoom-in-95
    "
                      >
                        {filteredTechs.map((tech, index) => (
                          <button
                            key={tech}
                            ref={(el) => {
                              itemRefs.current[index] = el;
                            }}
                            type="button"
                            onClick={() => addTech(tech)}
                            className={`w-full text-left px-3 py-2 text-sm transition ${
                              index === highlightIndex
                                ? "bg-muted"
                                : "hover:bg-muted"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SELECTED TAGS */}
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-muted/60 border hover:bg-muted transition"
                    >
                      {tech}
                      <button
                        onClick={() =>
                          setTechStack((prev) => prev.filter((t) => t !== tech))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* COUNTER */}
                {techStack.length === 10 && (
                  <p className="text-xs text-red-400">
                    {techStack.length}/10 technologies selected
                  </p>
                )}
              </div>
              <div className="mt-3 space-y-3">
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="GitHub Repo URL"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  disabled={isPosting}
                />

                <Input
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="Live Demo URL"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  disabled={isPosting}
                />
              </div>
            </div>
          )}

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
    </div>
  );
};

export default CreatePost;
