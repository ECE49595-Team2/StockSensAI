import { BookIcon, Bot, ChartBar, HomeIcon, Settings } from "lucide-react";

const NavigationItems = {
    "/dashboard": {
        title: "Home",
        icon: <HomeIcon />,
        description: "View your stocks and their performance.",
        subroutes: {}
    },
    "/dashboard/portfolio": {
        title: "Portfolio",
        icon: <BookIcon />,
        description: "View your portfolio and its performance.",
        subroutes: {}
    },
    "/dashboard/adviser": {
        title: "Adviser",
        icon: <Bot />,
        description: "Get recommendations on stocks to buy.",
        subroutes: {}
    },
    "/dashboard/insights": {
        title: "Insights",
        icon: <ChartBar />,
        description: "View insights on stocks and their performance.",
        subroutes: {}
    },
    "/dashboard/settings": {
        title: "Settings",
        icon: <Settings />,
        description: "View and edit your settings.",
        subroutes: {}
    }
}

export default NavigationItems;