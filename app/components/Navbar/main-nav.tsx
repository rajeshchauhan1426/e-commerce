"use client";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const storeId = params?.storeId; // Retrieve storeId from URL parameters

  // Define the routes array with the correct path structure
  const routes = [
    {
      href: `/${storeId}/`, // Adjusted to match dynamic structure
      label: "Overview",
      active: pathname === `/${storeId}/`,
    },
    {
      href: `/${storeId}/billboards`, // Adjusted to match dynamic structure
      label: "Billboards",
      active: pathname === `/${storeId}/billboards`,
    },
    {
      href: `/${storeId}/categories`, // Adjusted to match dynamic structure
      label: "Categories",
      active: pathname === `/${storeId}/categories`,
    },
    {
      href: `/${storeId}/sizes`, // Adjusted to match dynamic structure
      label: "Sizes",
      active: pathname === `/${storeId}/sizes`, // Ensures case-insensitive comparison
    },
    {
      href: `/${storeId}/colors`, // Adjusted to match dynamic structure
      label: "Colors",
      active: pathname === `/${storeId}/colors`, // Ensures case-insensitive comparison
    },
    {
      href: `/${storeId}/products`, // Adjusted to match dynamic structure
      label: "Products",
      active: pathname === `/${storeId}/products`, // Ensures case-insensitive comparison
    },
    {
      href: `/${storeId}/settings`, // Adjusted to match dynamic structure
      label: "Settings",
      active: pathname === `/${storeId}/settings`, // Ensures case-insensitive comparison
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href} // Use the 'href' for navigation
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}