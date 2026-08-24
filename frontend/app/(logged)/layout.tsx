import { cookies } from 'next/headers';
import SideBar from '../components/layout/sideBar';
import { redirect } from 'next/navigation';

export default async function TasksLayout({ children, }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken');

    // if (!token) {
    //     redirect('/login');
    // }

    return (

       <div className='flex min-h-screen bg-gray-100 dark:bg-[#0A0A0A] '>
            <SideBar/>
            <main className='flex-1 min-w-0'>
                {children}
            </main>
        </div>

    )
}

