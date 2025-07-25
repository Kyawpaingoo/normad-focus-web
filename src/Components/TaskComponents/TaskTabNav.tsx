import React, { useCallback } from 'react';
import { Tab, Tabs } from '@mui/material';
import type { ViewMode } from '../../dtos/responseDtos';
import { TAB_NAV_LIST } from '../../Ultils/taskData';

interface TaskTabNavProps {
    activeTab: ViewMode;
    onTabChange: (value: ViewMode) => void;
}

const TaskTabNav: React.FC<TaskTabNavProps> = ({ activeTab, onTabChange }) => {
    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: ViewMode) => {
        onTabChange(newValue);
    }, [onTabChange]);

    return (
        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
                minHeight: 40,
                '& .MuiTabs-indicator': { 
                background: '#222', 
                height: 2, 
                borderRadius: 1 
                },
            }}
            aria-label="Task view tabs"
        >
            {TAB_NAV_LIST.map((tab) => (
                <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                sx={{
                    minHeight: 40,
                    fontWeight: tab.value === activeTab ? 600 : 500,
                    color: '#222',
                    textTransform: 'none',
                    opacity: tab.value === activeTab ? 1 : 0.7,
                    mr: 2,
                }}
                />
            ))}
        </Tabs>
    );
};

export default TaskTabNav;