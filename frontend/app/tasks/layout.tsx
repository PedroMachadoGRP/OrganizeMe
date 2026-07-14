import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TasksLayout({ children, }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('access-token');

    // if (!token) {
    //     redirect('/login');
    // }

    return (
        <>{children}</>
    )
}

