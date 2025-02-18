const NavigationItems = {
    '/about': {
        title: 'About',
        description: 'Learn more about StockSensAI',
        subroutes: {
            '/about/mission': 'Our Mission',
            '/about/team': 'Our Team',
            '/about/tutorial': 'Tutorial',
        }
    },
    '/developers': {
        title: 'Developers',
        description: 'Developer resources',
        subroutes: {
            'https://github.com/ECE49595-Team2/StockSensAI': "Repository",
            'http://localhost:3000/attributions.html': "Attributions",
        }
    }
}

export default NavigationItems;