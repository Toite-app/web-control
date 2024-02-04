"use client";

import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";
import { LogOutIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import TOITE_CONFIG from "@config";
import { menuItems } from "./menu-items";
import NavMenuItem from "./components/MenuItem";
import { useNavigationStore } from "./store";
import { cn } from "@/lib/utils";
import ThemeButton from "./components/ThemeButton";

export const NavigationBar: FC = () => {
  const { isOpen, toggle } = useNavigationStore();

  return (
    <div
      data-open={isOpen}
      className="block border-r bg-stone-100/40 transition-all data-[open=false]:w-[82px] data-[open=true]:w-[300px] dark:bg-stone-800/40"
    >
      <div className="flex h-full max-h-[100vh] flex-col gap-2 overflow-clip">
        <div
          className={cn(
            "border-b border-stone-200 dark:border-stone-800",
            "flex flex-row items-center p-6 pb-4",
            !isOpen && "flex-col gap-3 p-1 pb-3 pt-6"
          )}
        >
          <div
            className={cn(
              "relative h-auto min-h-[30px] w-[200px] dark:invert",
              !isOpen && "min-h-[20px] w-[40px]"
            )}
          >
            <Image
              src={TOITE_CONFIG.logo.svg}
              fill
              style={{
                width: "100%",
                objectFit: "contain",
                objectPosition: "left",
              }}
              alt=""
              priority
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toggle();
            }}
          >
            <MenuIcon className={isOpen ? "h-6 w-6" : "h-3 w-3"} />
          </Button>
        </div>
        <div className="h-full flex-1 py-4">
          <ScrollArea className="navbar-tabs-height h-full w-full">
            <nav className="grid items-start gap-1 px-4 text-base font-medium">
              {menuItems.map((item) => (
                <NavMenuItem data={item} key={item.labelId} />
              ))}
            </nav>
          </ScrollArea>
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <ThemeButton showText={isOpen} />
          <div
            className={cn(
              "flex min-w-[250px] flex-row items-center border-t border-stone-200 p-4 dark:border-stone-800",
              !isOpen && "min-w-[40px]"
            )}
          >
            {isOpen && (
              <>
                <Avatar className="mr-4 h-9 w-9">
                  <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h3 className="whitespace-nowrap font-semibold">John Doe</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Admin
                  </p>
                </div>
              </>
            )}
            <Button
              className={cn(isOpen && "ml-auto", !isOpen && "w-full")}
              variant="outline"
              size="sm"
            >
              <LogOutIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
