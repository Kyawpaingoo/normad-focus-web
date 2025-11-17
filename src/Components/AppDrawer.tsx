import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useThemeHook } from "../Context/Theme";
import { useNavigate } from "react-router-dom";
import { Home, DollarSign, CheckSquare, Calendar, MapPin } from "lucide-react";

interface AppDrawerProps {
    open: boolean;
    onClose: () => void;
}

const AppDrawer: React.FC<AppDrawerProps> = ({open, onClose})=> {
    const {auth} = useThemeHook();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[300px] p-0">
                <div className="mb-6 w-full h-10 bg-background relative">
                    <div className="flex flex-row items-center gap-2 absolute left-5 bottom-[-30px]">
                        <Avatar className="w-6 h-6 bg-primary">
                            <AvatarFallback className="text-white text-xs">
                                {auth?.name?.[0] || 'G'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-bold">
                            {auth ? auth.name : 'Guest'}
                        </span>
                    </div>
                </div>

                <hr className="my-4 border-border" />
                <nav className="flex flex-col gap-1 px-2">
                    <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => handleNavigation('/')}
                    >
                        <Home className="h-5 w-5" />
                        <span>Home</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => handleNavigation('/expense')}
                    >
                        <DollarSign className="h-5 w-5" />
                        <span>Expense</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => handleNavigation('/task')}
                    >
                        <CheckSquare className="h-5 w-5" />
                        <span>Task</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => handleNavigation('/meeting')}
                    >
                        <Calendar className="h-5 w-5" />
                        <span>Meeting Schedule</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        onClick={() => handleNavigation('/country-log')}
                    >
                        <MapPin className="h-5 w-5" />
                        <span>Country Log</span>
                    </Button>
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default AppDrawer;