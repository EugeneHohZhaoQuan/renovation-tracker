// components/header.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Building, PlusCircle } from 'lucide-react';

export function Header() {
  return (
    // 1. Changed background to a subtle gray for better separation
    <header className="bg-dark-roast border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo/Title */}
          <div className="flex items-center">
            <Building className="h-8 w-8 text-off-white" />
            <h1 className="text-xl font-bold text-off-white ml-2">
              Renovation Tracker
            </h1>
          </div>

          {/* Right Side: Actions & Profile */}
          <div className="flex items-center space-x-4">
            {/* "Add New" Dropdown Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* 2. This className ensures the button is terracotta with white text */}
                <Button className="bg-terracotta hover:bg-terracotta/90 cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span>New Idea</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>New Expense</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>New Appointment</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>New Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Avatar & Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@user"
                  />
                  <AvatarFallback className="bg-silver-mist text-dark-roast font-bold">
                    ME
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-terracotta focus:text-terracotta focus:bg-terracotta/10">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
