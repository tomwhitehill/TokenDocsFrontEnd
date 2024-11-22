"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserRound, Eye, EyeOff } from "lucide-react";
import SearchBox from "../custom/search-box/search-box";
import { UserStore } from "@/store/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "@/queries/documentQueries";

export default function Header() {
  const { subscriptionKey, setSubscriptionKey } = UserStore();
  const [tempKey, setTempKey] = useState(subscriptionKey || "");
  const [isOpen, setIsOpen] = useState(subscriptionKey === null ? true : false);
  const [showKey, setShowKey] = useState(false);
  const queryClient = useQueryClient();

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempKey(e.target.value);
  };

  const handleSaveKey = () => {
    setSubscriptionKey(tempKey);
    setIsOpen(false);
    queryClient.invalidateQueries([documentKeys.all]);
  };

  return (
    <Card className="py-4 px-8 bg-[#F8FAFC] rounded-none flex items-center justify-between">
      <div className="flex">
        <SidebarTrigger className="block md:hidden" />
        <CardTitle className="tracking-wide text-xl text-primary-foreground">
          TokenDocs
        </CardTitle>
      </div>
      <CardContent className="flex items-center p-0 gap-2">
        <SearchBox />
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full h-auto p-2">
              <UserRound />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="focus:bg-background"
              onSelect={(e) => e.preventDefault()}
            >
              <div className="w-full space-y-2">
                <Label htmlFor="subscriptionKey">Subscription Key</Label>
                <div className="relative">
                  <Input
                    id="subscriptionKey"
                    type={showKey ? "text" : "password"}
                    value={tempKey}
                    onChange={handleKeyChange}
                    placeholder="Enter your key"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleSaveKey}
                  className="w-full rounded-full text-white"
                >
                  Save
                </Button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
