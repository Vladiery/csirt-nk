import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, delay = 0, className = '' }) {
    const ref = useRef(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || !('IntersectionObserver' in window)) { setShown(true); return undefined; }
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setShown(true); io.disconnect(); }
        }, { threshold: 0.15 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            className={`transition duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} ${className}`}
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
