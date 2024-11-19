// COMPONENTS
import SearchBox from "../custom/search-box/search-box";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// ICONS
import { Bolt, Link2, UserRound } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
  return (
    <Card className="py-4 px-8 bg-secondary rounded-none flex items-center justify-between">
      <div className="flex">
        <SidebarTrigger className="block md:hidden" />
        <CardTitle className="tracking-wide text-xl">Assets</CardTitle>
      </div>
      <CardContent className="flex items-center p-0 gap-2">
        <SearchBox />
        <Button variant={"outline"} className="rounded-full h-auto p-2">
          <Bolt />
        </Button>
        <Button variant={"outline"} className="rounded-full h-auto p-2">
          <Link2 />
        </Button>
        <Button variant={"outline"} className="rounded-full h-auto p-2">
          <UserRound />
        </Button>
      </CardContent>
    </Card>
  );
}
