"use client";
import Combobox from "@/components/combobox";
import Section, { SettingsType } from "./section";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shadcn/ui/button";
import { Switch } from "@/shadcn/ui/switch";

function Settings_Client({ savedSettings }: { savedSettings: { [key: string]: any } }) {
    const [settings, setSettings] = useState<{ [key: string]: any }>(savedSettings);
    const [isModified, setIsModified] = useState(false);

    async function submitSettings() {
        const response = await fetch("/api/user/prefs", {
            method: "POST",
            body: JSON.stringify(settings),
        });

        if (response.ok) {
            toast.success("Successfully updated settings", {
                richColors: true,
                dismissible: true,
                position: "top-center",
            });
            setIsModified(false); // Reset modification state after successful save
        } else {
            toast.error("Failed to update settings", {
                richColors: true,
                dismissible: true,
                position: "top-center",
            });
        }
    }

    const llmSettings: SettingsType[] = [
        {
            subtitle: "Model",
            description: "Select the model you want to use for your portfolio analysis.",
            value: (
                <Combobox
                    value={settings.llmSettings?.model || "DeepSeekV3"}
                    setValue={(value) => {
                        setSettings((prev) => {
                            const updatedSettings = { ...prev, llmSettings: { ...prev.llmSettings, model: value } };
                            setIsModified(JSON.stringify(updatedSettings) !== JSON.stringify(savedSettings)); // Check if settings are modified
                            return updatedSettings;
                        });
                    }}
                    items={[
                        { label: "DeepSeekV3", value: "DeepSeekV3" },
                        { label: "DeepSeekR1", value: "DeepSeekR1" },
                        { label: "LLAMA", value: "LLAMA" },
                    ]}
                    placeholderEmpty="Select a model"
                    placeholderValue="DeepSeekV3"
                    placeholderSearchInput="Search for a model"
                />
            ),
        },
        {
            subtitle: "Full Perspective",
            description: "Enable this to get a comprehensive analysis of your portfolio, including all stocks and their performance.",
            value:
                <Switch
                    checked={settings.llmSettings?.fullPerspective || false}
                    onCheckedChange={(checked) => {
                        setSettings((prev) => {
                            const updatedSettings = { ...prev, llmSettings: { ...prev.llmSettings, fullPerspective: checked } };
                            setIsModified(JSON.stringify(updatedSettings) !== JSON.stringify(savedSettings)); // Check if settings are modified
                            return updatedSettings;
                        });
                    }} />
        },
    ];

    useEffect(() => {
        console.log("Settings updated:", settings);
    }, [settings]);

    return (
        <div>
            <Button
                variant={"default"}
                className="mb-10 w-full h-20 cursor-pointer"
                onClick={submitSettings}
                disabled={!isModified} // Disable button if settings are not modified
            >
                Save Settings
            </Button>
            <Section
                title="LLM Settings"
                description="Manage your AI model preferences."
                settings={llmSettings}
            />
        </div>
    );
}

export default Settings_Client;