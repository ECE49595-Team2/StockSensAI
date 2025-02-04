import Image from 'next/image';
import { fonts } from '../app/layout';

function Nav() 
{
    return(
        <nav className='flex flex-row justify-around items-center p-4'>
            <div id="logo" className={`flex flex-row gap-2 items-center ${fonts.primary.className} text-2xl`}>
                <Image src="/logo.svg" alt="logo" width={100} height={100} />
                <h1>
                    <span className='text-primary'>Stock</span>
                    <span className='text-secondary'>Sens</span>
                    <span className='text-gray-300'>AI</span>
                </h1>
            </div>
            <div id="navitems">
                <ul className='flex flex-row justify-between items-center'>
                    <li className='mx-4'>Home</li>
                    <li className='mx-4'>About</li>
                    <li className='mx-4'>Contact</li>
                </ul>
            </div>
            <div id="getStarted">
                <button className='bg-accent text-white font-bold py-2 px-4 rounded'>Get Started</button>
            </div>
        </nav>
    )
}

export default Nav;