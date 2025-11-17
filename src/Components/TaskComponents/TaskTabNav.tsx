import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ViewMode } from '../../dtos/responseDtos';
import { TAB_NAV_LIST } from '../../Ultils/taskData';

interface TaskTabNavProps {
    activeTab: ViewMode;
    onTabChange: (value: ViewMode) => void;
}

const TaskTabNav: React.FC<TaskTabNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <Tabs
            value={activeTab}
            onValueChange={(value) => onTabChange(value as ViewMode)}
            className="w-auto"
        >
            <TabsList className="h-10 bg-transparent p-0 border-b border-border rounded-none">
                {TAB_NAV_LIST.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none mr-4 px-0"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
};

export default TaskTabNav;