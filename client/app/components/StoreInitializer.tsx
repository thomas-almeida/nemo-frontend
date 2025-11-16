'use client';

import { useEffect } from 'react';
import useUserStore from '@/app/store/user-store';
import { Session } from 'next-auth';

type StoreInitializerProps = {
    session: Session | null;
};

function StoreInitializer({ session }: StoreInitializerProps) {
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        if (session?.user?._id) {
            setUser({
                _id: session.user._id,
                username: session.user.username || '',
                email: session.user.email || '',
                sessionId: session.user.sessionId || '',
            });
        }
    }, [session, setUser]);

    return null;
}

export default StoreInitializer;
