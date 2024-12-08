"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
    className,
    ...props
}:React.HtmlHTMLAttributes<HTMLElement>){

    const pathname = usePathname();
    const params = useParams();
    const storeId = params?.storeId;
    const routes = [
        {
            herf: `/${storeId}/settings`,
            label:'Settings',
            active: pathname === `/${storeId}/settings`
        }
    ]
    return(
        <nav className={cn("flex items-center space-x-4 lg:space-x-6 ", className)}>
            {routes.map((route) => (
                <Link
                key={route.herf}
                href={route.herf}
                className={cn("text-sm font-medium transition-colors hover:text-primary", route.active? "text-black dark:text-white": "text-muted-foreground")}>

                    {route.label}
                </Link>
            ))}

        </nav>
    )
}
