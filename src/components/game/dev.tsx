import type { JSX } from 'react';
import '@/assets/loading.css'

export function DevBuildTag(): JSX.Element {
    return (
        <a
            className={'devWatermark'}
            href={'mailto:talk@bilalcode.com'}
            target={'_blank'}
        >[Dev Build] BilalCode<sup>TM</sup></a>
    );
}