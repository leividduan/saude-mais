import {
  NavLink as RouterNavLink,
  NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface NavLinkProps extends Omit<RouterNavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  roles?: UserRole[];
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      roles,
      ...props
    },
    ref
  ) => {
    const { user } = useAuth();

    if (roles && !roles.includes(user?.role as UserRole)) {
      return null;
    }

    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
