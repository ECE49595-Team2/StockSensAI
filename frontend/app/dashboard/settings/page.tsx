import { Button } from "@/shadcn/ui/button";
import Combobox from "@/components/combobox";

const tradingAlgos = [
    {
        label: "RSI",
        value: "RSI"
    },
    {
        label: "MACD",
        value: "MACD"
    },
    {
        label: "SMA",
        value: "SMA"
    },
    {
        label: "EMA",
        value: "EMA"
    },
]

async function Settings() {
    return (
        <div className="w-full h-full flex flex-col gap-10 text-black justify-start">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-md text-gray-500">Manage your account settings.</p>
                <Button className="h-10 w-30 cursor-pointer">Save Changes</Button>
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-xl">Trading Settings</h2>
                    <p className="text-md text-gray-500">Manage the settings used for trading algorithms</p>
                </div>
                <div className="p-4 flex flex-row gap-5">
                    <div>
                        <h3 className="text-md">Trading Algorithm</h3>
                        <p className="text-sm text-gray-500">Select the trading algorithm you want to use.</p>
                    </div>
                    <div>
                        <Combobox items={tradingAlgos} placeholderEmpty="No algorithm found" placeholderValue={"Select an algorithm..."} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;