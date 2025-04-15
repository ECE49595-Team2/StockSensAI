import { BookIcon, Bot, HomeIcon, Settings } from "lucide-react";

const NavigationItems = {
    "/dashboard": {
        title: "Home",
        icon: <HomeIcon />,
        description: "View your stocks and their performance.",
        subroutes: {}
    },
    "/dashboard/portfolios": {
        title: "Portfolios",
        icon: <BookIcon />,
        description: "View your portfolios and their performances.",
        subroutes: {}
    },
    "/dashboard/adviser": {
        title: "Adviser",
        icon: <Bot />,
        description: "Get recommendations on stocks to buy.",
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