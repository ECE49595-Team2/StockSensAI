import { Card, CardContent, CardTitle } from "@/shadcn/ui/card";

function SettingsCard({ title, description, content }: { title: string; description: string; content: any }) {
    return (
        <Card className="p-4 block overflow-hidden col-span-2 bg-secondary text-black flex flex-row gap-4 items-center">
            <CardTitle className="text-md font-bold text-black">{title}</CardTitle>
            <CardContent className="text-sm text-gray-500">
                {content}
            </CardContent>
        </Card>
    );
}

export default SettingsCard;