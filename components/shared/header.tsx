'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserRound, Eye, EyeOff } from 'lucide-react'
import { UserStore } from "@/store/userStore"
import { useQueryClient } from '@tanstack/react-query'
import { documentKeys } from "@/queries/documentQueries"
import Image from "next/image"

export default function Header() {
  const { subscriptionKey, setSubscriptionKey } = UserStore();
  const [tempKey, setTempKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const queryClient = useQueryClient()

  useEffect(() => {
    const storedKey = localStorage.getItem('user-store');
    if (storedKey) {
      const parsedKey = JSON.parse(storedKey);
      if (parsedKey.state && parsedKey.state.subscriptionKey) {
        setTempKey(parsedKey.state.subscriptionKey);
      } else {
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    setTempKey(subscriptionKey || "");
  }, [subscriptionKey]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempKey(e.target.value)
  }

  const handleSaveKey = () => {
    setSubscriptionKey(tempKey)
    setIsOpen(false)
    queryClient.invalidateQueries(documentKeys.all)
  }

  return (
    <Card className="bg-[#F8FAFC] h-[70px] rounded-none flex items-center justify-between">
      <div className="flex">
        <SidebarTrigger className="block md:hidden" />
        <figure className="w-52 h-[70px] relative"> <Image src="/logo/TokenDocs.png" alt="TokenDocs" className="object-contain" fill /> </figure>
      </div>
      <CardContent className="flex items-center p-0 gap-2 pr-8 py-4">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full h-auto p-2">
              <UserRound />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="focus:bg-background" onSelect={(e) => e.preventDefault()}>
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
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleSaveKey} className="w-full text-white hover:bg-primaryTwo">
                  Save Key
                </Button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

