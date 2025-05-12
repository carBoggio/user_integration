import React from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  Button 
} from "@heroui/react";
import { Sun, Moon, Github } from "lucide-react";
import { useTheme } from '@/providers/themeProvider';
import ConnectWalletButton from './ConectWalletButton';


// Triangle Logo component
const Logo: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 19.5H22L12 2Z" fill="currentColor" />
  </svg>
);

const CustomNavbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Navbar 
      maxWidth="xl" 
      position="sticky" 
      isBlurred
      onMenuOpenChange={setIsMenuOpen}
      className="bg-background/80 backdrop-blur-md"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit ml-2">HeroUI</p>
        </NavbarBrand>
      </NavbarContent>
      
      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand>
          <Logo />
          <p className="font-bold text-inherit ml-2">HeroUI</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <Link color="foreground" href="#" aria-current="page">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Pricing
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            How It Works
          </Link>
        </NavbarItem>
        
        {/* Wallet button with divider */}
        <div className="flex items-center border-l border-divider h-8 pl-4 pr-4">
          <ConnectWalletButton />
        </div>
        
        {/* GitHub and theme buttons with divider */}
        <div className="flex items-center border-l border-divider h-8 pl-4">
          <Button 
            isIconOnly
            variant="bordered"
            size="sm"
            radius="full"
            as={Link}
            href="https://github.com/example/heroui"
            target="_blank"
            className="min-w-8 w-8 h-8 border-default-200 mr-2"
            aria-label="GitHub"
          >
            <Github size={18} />
          </Button>
          <Button 
            isIconOnly
            variant="bordered"
            size="sm"
            radius="full"
            onClick={toggleTheme}
            className="min-w-8 w-8 h-8 border-default-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </NavbarContent>
      
      {/* Mobile menu toggle and icons on the right */}
      <NavbarContent className="sm:hidden" justify="end">
        <div className="flex items-center gap-2">
         
          <Button 
            isIconOnly
            variant="bordered"
            size="sm"
            radius="full"
            as={Link}
            href="https://github.com/example/heroui"
            target="_blank"
            className="min-w-8 w-8 h-8 border-default-200"
            aria-label="GitHub"
          >
            <Github size={18} />
          </Button>
          <Button 
            isIconOnly
            variant="bordered"
            size="sm"
            radius="full"
            onClick={toggleTheme}
            className="min-w-8 w-8 h-8 border-default-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </div>
      </NavbarContent>
      
      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className="w-full"
            href="#"
            size="lg"
          >
            Home
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className="w-full"
            href="#"
            size="lg"
          >
            Pricing
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            color="foreground"
            className="w-full"
            href="#"
            size="lg"
          >
            How It Works
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default CustomNavbar;