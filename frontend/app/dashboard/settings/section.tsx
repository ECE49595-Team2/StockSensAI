import React from "react";
import SettingsCard from "./settings-card";

export type SettingsType = {
    subtitle: string;
    description: string;
    value: React.ReactNode;
}

function Section({ title, description, settings }: { title: string; description: string; settings: SettingsType[] }) {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl">{title}</h2>
                <p className="text-md text-gray-500">{description}</p>
            </div>
            <div className="p-4 flex flex-col gap-5">
                {settings.map((setting, index) => (
                    <SettingsCard key={index} title={setting.subtitle} description={setting.description} content={setting.value} />
                ))}
            </div>
        </div>
    );
}

export default Section;