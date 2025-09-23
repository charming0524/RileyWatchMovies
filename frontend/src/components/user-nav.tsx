import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router";

export function UserNav() {
  const auth = useAuth();

  if (!auth.user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-foreground hover:text-background hover:bg-chart-3/10"
          size="sm"
          asChild
        >
          <a href="/login">Login</a>
        </Button>
        <Button
          size="sm"
          className=" hover:text-foreground hover:bg-background"
          asChild
        >
          <a href="/register">Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 text-foreground hover:bg-destructive hover:text-chart-3 cursor-pointer">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>
              {auth.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {auth.user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {auth.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>
              <Link
                to="/profile"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Profile
              </Link>
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() => {
            auth.logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
