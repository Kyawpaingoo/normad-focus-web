import { Button } from "@mui/material";
import { useICSContent } from "../../Hooks/useICSContent"
import type React from "react";

interface ICSDownloadButtonProps {
    meetingId: number,
    userId: number
}
const ICSDownloadButton: React.FC<ICSDownloadButtonProps> = ({ meetingId, userId }) => {
    const {data, isLoading, isError, error} = useICSContent(meetingId, userId);

    const handleDownload = () => {
        if(!data) return;

        const blob = new Blob([data], {type: 'text/calendar'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `meeting-${meetingId}.ics`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    if (isLoading) return <p>Generating calendar...</p>;

    if (isError) return <p>Error: {error.message}</p>;

    return <Button onClick={handleDownload}>Download Meeting Schedule (.ics)</Button>
}

export default ICSDownloadButton;