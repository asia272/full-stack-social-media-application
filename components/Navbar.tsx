import { getUserByClerkId, syncUser } from "@/app/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import CreateDropdown from "./CreateDropdown";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { Code2Icon } from "lucide-react";

const Navbar = async () => {
  // 1. Get current Clerk user
  const clerkUser = await currentUser();

  let user = null;

  if (clerkUser) {
    // 2. Sync user to DB
    await syncUser();

    // 3. Fetch fresh user from DB
    user = await getUserByClerkId(clerkUser.id);
  }

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur mb-4 supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 transition-all duration-300"
            >
              {/* Icon */}
              <div className="relative flex items-center justify-center w-10 h-10">
                {/* Rotating Wrapper */}
                <div className="absolute inset-0 animate-spin-slow">
                  {/* Small Dot */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary border border-background" />
                </div>

                {/* Outer Ring */}
                <div className="w-10 h-10 rounded-full border-[1.5px] border-primary/70 flex items-center justify-center transition-all duration-300 group-hover:border-primary">
                  <Code2Icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
              {/* Text */}
              <h2 className="text-xl font-black tracking-tight">
                <span className="text-foreground">Dev</span>
                <span className="text-primary">Connect</span>
              </h2>
            </Link>
          </div>
          <DesktopNavbar />

          {clerkUser && <CreateDropdown />}

          <MobileNavbar user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
