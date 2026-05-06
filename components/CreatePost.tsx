"use client";

import { createPost } from "@/app/actions/post.action";
import { TECH_SUGGESTIONS } from "@/data/TechSuggestions";
import { useUser } from "@clerk/nextjs";
import { FileWarning, ImageIcon, Loader2Icon, SendIcon, X } from "lucide-react";
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
    if (techStack.length >= 5) {
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
    <Card>
      <CardContent className="pt-6 space-y-5">
        {/* TITLE */}
        <div className="space-y-1">
          <label className="text-sm font-medium ">
            {mode === "PROJECT" ? "Project Title" : "Post Title"}
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              mode === "PROJECT"
                ? "e.g. Social Media App"
                : "What's on your mind?"
            }
            className="w-full"
            disabled={isPosting}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder={
              mode === "PROJECT"
                ? "Describe your project..."
                : "Share your thoughts..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
            className="min-h-[100px]"
          />
        </div>

        {/* PROJECT FIELDS */}
        {mode === "PROJECT" && (
          <>
            <div className="space-y-4 flex flex-col lg:flex-row gap-4">
              
              <div className="space-y-1">
                <label className="text-sm font-medium">GitHub URL</label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  disabled={isPosting}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium ">Live Demo URL</label>
                <Input
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://your-site.com"
                  disabled={isPosting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Which tools, libraries, frameworks, or methodologies did you use
                for this project?
              </label>

              <div className="relative">
                <Input
                  value={techInput}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="React, Next.js..."
                  onKeyDown={(e) => {
                    if (!showDropdown) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightIndex((prev) =>
                        prev < filteredTechs.length - 1 ? prev + 1 : 0,
                      );
                    }

                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightIndex((prev) =>
                        prev > 0 ? prev - 1 : filteredTechs.length - 1,
                      );
                    }

                    if (e.key === "Enter") {
                      e.preventDefault();

                      if (highlightIndex >= 0) {
                        addTech(filteredTechs[highlightIndex]);
                      } else if (filteredTechs.length > 0) {
                        addTech(filteredTechs[0]);
                      }

                      setShowDropdown(false);
                    }

                    if (e.key === "Escape") {
                      setShowDropdown(false);
                    }
                  }}
                />

                {/* DROPDOWN */}
                {showDropdown && techInput.trim() && (
                  <div ref={techBoxRef} className="absolute z-10 mt-2 w-full">
                    <div className="rounded-xl border bg-background shadow-lg max-h-48 overflow-auto">
                      {filteredTechs.map((tech, index) => (
                        <button
                          key={tech}
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          type="button"
                          onClick={() => addTech(tech)}
                          className={`w-full text-left px-3 py-2 text-sm ${
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

              {/* TAGS */}
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-muted border"
                  >
                    {tech}
                    <button
                      onClick={() =>
                        setTechStack((prev) => prev.filter((t) => t !== tech))
                      }
                      className="text-red-500"
                    >
                      <X size="12" className="hover:cursor-pointer" />
                    </button>
                  </span>
                ))}
              </div>

              {techStack.length === 5 && (
                <p className="text-xs text-red-400">
                  You can only choose a maximum of 5 options
                </p>
              )}
            </div>
          </>
        )}

        {/* IMAGE */}
        {showImageUpload && (
          <div className="border rounded-xl p-4">
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

        {/* ACTIONS */}
        <div className="flex items-center justify-between border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUpload(!showImageUpload)}
            disabled={isPosting}
          >
            <ImageIcon className="size-4 mr-2" />
            Photo
          </Button>

          <Button
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
