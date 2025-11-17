import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type React from "react";

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

const Item: React.FC<ItemProps> = ({ children, className, ...props }) => {
    return (
        <Card
            className={cn(
                "bg-background dark:bg-[#1A2027] p-4 text-center text-sm text-muted-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Card>
    );
};

export default Item;