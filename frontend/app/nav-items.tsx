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
            'https://github.com': "Repository",
            'https://github.com/docs': "Documentation",
        }
    }
}

export default NavigationItems;