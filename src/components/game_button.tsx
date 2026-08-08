import type { JSX, ReactNode } from 'react';
import { SfxManager } from '@/app/page';

interface GameButtonComponentProps {
    sfx: SfxManager;
    children?: ReactNode;
    onClick?: (e: unknown) => void;
    onMouseOver?: (e: unknown) => void;
}

export function GameButton<T extends GameButtonComponentProps>({
    children,
    sfx,
    ...props
}: T): JSX.Element {

    return (
        <button

            {...props}

            onClick={(e: unknown) => {
                sfx('buttonClicked');
                props.onClick?.(e);
            }}

            onMouseOver={(e: unknown) => {
                sfx('buttonHover');
                props.onMouseOver?.(e);
            }}

        >{children}</button>
    );
}