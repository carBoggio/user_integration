declare module '@heroui/react' {
  import { FC, ReactNode } from 'react';

  export interface HeroUIProviderProps {
    children: ReactNode;
    navigate: (to: string) => void;
    useHref: (to: string) => string;
  }

  export const HeroUIProvider: FC<HeroUIProviderProps>;

  export interface ButtonProps {
    children?: ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'solid' | 'flat' | 'ghost' | 'light';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    isDisabled?: boolean;
    onPress?: () => void;
    className?: string;
    startContent?: ReactNode;
    endContent?: ReactNode;
    [key: string]: any;
  }

  export const Button: FC<ButtonProps>;

  export interface CardProps {
    children?: ReactNode;
    className?: string;
    [key: string]: any;
  }

  export const Card: FC<CardProps>;
  export const CardHeader: FC<CardProps>;
  export const CardBody: FC<CardProps>;
  export const CardFooter: FC<CardProps>;

  export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    [key: string]: any;
  }

  export const Spinner: FC<SpinnerProps>;

  export interface ChipProps {
    children?: ReactNode;
    color?: string;
    variant?: string;
    size?: 'sm' | 'md' | 'lg';
    [key: string]: any;
  }

  export const Chip: FC<ChipProps>;

  export interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    children?: ReactNode;
    [key: string]: any;
  }

  export const Modal: FC<ModalProps>;
  export const ModalContent: FC<CardProps>;
  export const ModalHeader: FC<CardProps>;
  export const ModalBody: FC<CardProps>;
  export const ModalFooter: FC<CardProps>;

  export interface InputProps {
    value?: string | number;
    onChange?: (e: any) => void;
    placeholder?: string;
    type?: string;
    [key: string]: any;
  }

  export const Input: FC<InputProps>;

  export interface UseDisclosureReturn {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
  }

  export function useDisclosure(defaultIsOpen?: boolean): UseDisclosureReturn;

  export interface ImageProps {
    src: string;
    alt?: string;
    [key: string]: any;
  }

  export const Image: FC<ImageProps>;

  export interface DividerProps {
    className?: string;
    [key: string]: any;
  }

  export const Divider: FC<DividerProps>;
} 