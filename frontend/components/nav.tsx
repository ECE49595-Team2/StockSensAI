"use client";
import NavigationItems from '@/app/nav-items';
import { Button } from '@/shadcn/ui/button';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@/shadcn/ui/navigation-menu';
import { SidebarTrigger } from '@/shadcn/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from '@/public/logo.png';
import AuthDrawer from './auth/auth-drawer';
import { useUser } from '@/hooks/use-user';
import { ChatBubbleType } from '@/app/dashboard/adviser/chat-bubble';
import { useChatStore } from '@/hooks/use-chat';
import User from '@/models/user-model';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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

    const [scrollY, setScrollY] = useState(0);
    const user = useUser((state) => state.user);
    const searchParams = useSearchParams();
    const setUser = useUser((state) => state.setUser);
    const setMessages = useChatStore((state => state.setMessages));
    const unauthorizedParam = searchParams.get('unauthorized');
    

    useEffect(() => {
        setScrollY(window.scrollY / 100);

        const handleScroll = () => {
            setScrollY(window.scrollY / 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [user]);


  useEffect(() => {
    fetch("/api/user/verify", {
      method: "GET",
      cache: "no-store",
    }).then(async (response) => {
      const data = await response.json();
      console.log("data", data);
      if (response.ok && data.email) {
        const user = new User(data.email);
        setUser(user);
      } else {
        setUser(undefined);
        setMessages(() => [] as { content: string; role: ChatBubbleType }[]);
      }
    })
  }, [unauthorizedParam, setUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      const unauthorized: boolean = unauthorizedParam === 'true';
      if (unauthorized) {
        toast.error("You are not authorized to view this page.", {
          richColors: true,
          description: "Please log in to view this page.",
          position: "top-center"
        });
        window.history.replaceState({}, document.title, "/");
        return;
      }
    }

    setTimeout(() => {
      handleUnauthorized();
    }, 0);
  }, [unauthorizedParam]);

    return (
        <nav className={`flex flex-row justify-start sm:justify-around items-center p-4 fixed w-full z-50 h-[7rem] transition-all duration-10 backdrop-blur-lg ${scrollY >= 0.6 ? 'shadow-lg' : ''}`} style={{ backgroundColor: `rgba(61, 43, 86, ${scrollY >= 0.7 ? 0.7 : scrollY})` }}>
            <SidebarTrigger size={'icon'} className='sm:hidden flex' />
            <Link href='/'>
                <div id="logo" className={`flex flex-row gap-2 items-center font-anton text-xl select-none`}>

                    <Image src={Logo} alt="logo" width={100} height={100} draggable={false} />
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
                                    <NavigationMenuTrigger key={key}>
                                        {navigationItems[key].title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className='h-[7rem] w-[max-content] p-2 flex flex-row gap-2'>
                                            <div className='w-[50%] h-full flex flex-col justify-center items-center bg-primary rounded text-white text-lg font-bold p-4 border-box text-wrap'>
                                                {navigationItems[key].description}
                                            </div>
                                            <div key={key} className='w-[max-content] h-[max-content] flex flex-col justify-center items-start text-sm font-bold p-2 text-black text-left underline gap-2'>
                                                {Object.keys(navigationItems[key].subroutes).map((subkey: string) => (
                                                    <Link key={subkey} href={subkey} className='hover:text-tertiary'>
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
            <div id="getStarted" className='hidden sm:flex'>
                {!user ?
                    <AuthDrawer>
                        <Button variant={"default"}>Get Started</Button>
                    </AuthDrawer> :
                    <Link href="/dashboard">
                        <Button variant={"outline"} >Go to Dashboard</Button>
                    </Link>
                }
            </div>
        </nav>
    )
}

export default Nav;