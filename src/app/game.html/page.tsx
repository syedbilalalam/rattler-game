'use client'
import { useEffect } from 'react';
export default function Page() {
    useEffect(() => {
        location.replace(location.origin);
    }, []);
}