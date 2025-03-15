import { useState } from "react";
import { Link } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="ml-2 text-xl font-semibold">ToolKit</span>
              </a>
            </Link>
          </div>
          
          {/* Search */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  id="search" 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" 
                  placeholder="Search tools" 
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" 
              aria-controls="mobile-menu" 
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center">
            <Link href="/">
              <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">Home</a>
            </Link>
            <Link href="/?filter=popular">
              <a className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">Popular Tools</a>
            </Link>
            <Link href="/?category=Developer">
              <a className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">Categories</a>
            </Link>
            <a href="#footer" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">About</a>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuVisible && (
        <div id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">Home</a>
            </Link>
            <Link href="/?filter=popular">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">Popular Tools</a>
            </Link>
            <Link href="/?category=Developer">
              <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">Categories</a>
            </Link>
            <a href="#footer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100">About</a>
          </div>
        </div>
      )}
    </header>
  );
}
