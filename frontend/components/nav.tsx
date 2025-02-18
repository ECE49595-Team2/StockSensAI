"use client";
import NavigationItems from '@/app/nav-items';
import { Button } from '@/shadcn/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@/shadcn/ui/navigation-menu';
import { SidebarTrigger } from '@/shadcn/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type NavigationItemsType = {
    [key: string]: {
        title: string;
        description: string;
        subroutes: {
            [key: string]: string;
        }
    }
}

const navigationItems: NavigationItemsType = NavigationItems;

function Nav() {

    const [scrollY, setScrollY] = useState(window.scrollY / 100);

    console.log(navigationItems['/about'].subroutes);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY / 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`flex flex-row justify-around items-center p-4 fixed w-full z-50 h-[150px] transition-all duration-10 backdrop-blur-lg ${scrollY >= 0.5 ? 'shadow-lg' : ''}`} style={{ backgroundColor: `rgba(61, 43, 86, ${scrollY >= 0.5 ? 0.5 : scrollY})` }}>
            <SidebarTrigger size={'icon'} className='sm:hidden flex' />
            <Link href='/'>
                <div id="logo" className={`flex flex-row gap-2 items-center font-anton text-2xl select-none`}>

                    <Image src="/logo.svg" alt="logo" width={100} height={100} draggable={false} />
                    <h1>
                        <span className='text-primary'>Stock</span>
                        <span className='text-secondary'>Sens</span>
                        <span className='text-gray-300'>AI</span>
                    </h1>

                </div>
            </Link>
            <div id="navitems" className='hidden sm:flex flex-row gap-4'>
                <NavigationMenu>
                    <NavigationMenuList className='font-giest-mono'>
                        {
                            Object.keys(navigationItems).map((key: string) => (
                                <NavigationMenuItem key={key}>
                                    <NavigationMenuTrigger>
                                        {navigationItems[key].title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className='h-[150px] w-[300px] p-2 flex flex-row gap-2'>
                                            <div className='w-1/2 h-full flex flex-col justify-center items-center bg-primary rounded text-white text-lg font-bold p-2'>
                                                {navigationItems[key].description}
                                            </div>
                                            <div className='w-1/2 h-full flex flex-col justify-center items-start text-sm font-bold p-2 text-black text-left underline gap-2'>
                                                {Object.keys(navigationItems[key].subroutes).map((subkey: string) => (
                                                    <Link href={subkey} className='hover:text-tertiary'>
                                                        <p>
                                                            {navigationItems[key].subroutes[subkey]}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                        
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
            <div id="getStarted">
                <Button variant={"default"}>Get Started</Button>
            </div>
        </nav>
    )
}

export default Nav;