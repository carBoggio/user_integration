import React from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as HeroUILink,
  Button,
  Tooltip
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Github, User, Ticket } from "lucide-react";
import { useTheme } from '@/providers/themeProvider';
import ConnectWalletButton from './ConectWalletButton';
import Logo from './Logo';

const CustomNavbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToLottery = () => {
    navigate('/lottery');
  };

  const goToHowItWorks = () => {
    navigate('/lottery#how-it-works');
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
        <NavbarBrand className="cursor-pointer" onClick={goToHome}>
          <Logo size="sm" />
        </NavbarBrand>
      </NavbarContent>
      
      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand className="cursor-pointer" onClick={goToHome}>
          <Logo size="md" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <RouterLink to="/" className="text-foreground">
            Home
          </RouterLink>
        </NavbarItem>
        {/* <NavbarItem>
          <RouterLink to="/raffles" className="text-foreground">
            Raffles
          </RouterLink>
        </NavbarItem> */}
        <NavbarItem>
          <RouterLink to="/lottery" className="text-foreground flex items-center gap-1">
            <Ticket size={16} className="text-purple-500" />
            Lottery
          </RouterLink>
        </NavbarItem>
        <NavbarItem>
          <RouterLink to="/lottery#how-it-works" className="text-foreground">
            How It Works
          </RouterLink>
        </NavbarItem>
        
        {/* Wallet button with divider */}
        <div className="flex items-center border-l border-divider h-8 pl-4 pr-4">
          <ConnectWalletButton />
        </div>
        
        {/* GitHub, profile and theme buttons with divider */}
        <div className="flex items-center border-l border-divider h-8 pl-4">
          <Tooltip content="Profile">
            <Button 
              isIconOnly
              variant="bordered"
              size="sm"
              radius="full"
              onPress={goToProfile}
              className="min-w-8 w-8 h-8 border-default-200 mr-2"
              aria-label="User Profile"
            >
              <User size={18} className="text-purple-500" />
            </Button>
          </Tooltip>
          <Button 
            isIconOnly
            variant="bordered"
            size="sm"
            radius="full"
            as={HeroUILink}
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
          <Tooltip content="Lottery">
            <Button 
              isIconOnly
              variant="bordered"
              size="sm"
              radius="full"
              onPress={goToLottery}
              className="min-w-8 w-8 h-8 border-default-200"
              aria-label="Lottery"
            >
              <Ticket size={18} className="text-purple-500" />
            </Button>
          </Tooltip>
          <Tooltip content="Profile">
            <Button 
              isIconOnly
              variant="bordered"
              size="sm"
              radius="full"
              onPress={goToProfile}
              className="min-w-8 w-8 h-8 border-default-200"
              aria-label="User Profile"
            >
              <User size={18} className="text-purple-500" />
            </Button>
          </Tooltip>
          <Button 
            isIconOnly
            variant="bordered"
            size="sm"
            radius="full"
            as={HeroUILink}
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
          <RouterLink
            to="/"
            className="w-full text-foreground text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </RouterLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <RouterLink
            to="/raffles"
            className="w-full text-foreground text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Raffles
          </RouterLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <RouterLink
            to="/lottery"
            className="w-full text-foreground text-lg flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <Ticket size={18} className="text-purple-500" />
            Lottery
          </RouterLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <RouterLink
            to="/lottery#how-it-works"
            className="w-full text-foreground text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </RouterLink>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <RouterLink
            to="/profile"
            className="w-full text-foreground text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            My Profile
          </RouterLink>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default CustomNavbar;