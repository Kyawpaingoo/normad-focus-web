import { Tab, Tabs } from "@mui/material";
import { TabNavList } from "../../Ultils/taskData";
import type React from "react";
import type { ViewMode } from "../../dtos/responseDtos";
interface TaskTabNavProps {
    tab: ViewMode,
    onChange: (value: ViewMode) => void;
}

const TaskTabNav: React.FC<TaskTabNavProps> = ({tab, onChange})=> {
    
    
    return (
        <Tabs value={tab}
            onChange={(_, newValue) => onChange(newValue)}
            sx={{
                minHeight: 40,
                "& .MuiTabs-indicator": { background: "#222", height: 2, borderRadius: 1 },
            }}
        >
            {TabNavList.map((t) => (
                <Tab
                    key={t.value}
                    label={t.label}
                    value={t.value}
                    sx={{
                        minHeight: 40,
                        fontWeight: t.value === "board" ? 600 : 500,
                        color: "#222",
                        textTransform: "none",
                        opacity: t.value === "board" ? 1 : 0.7,
                        mr: 2,
                    }}
                />
            ))}
        </Tabs>
    )
}

export default TaskTabNav;