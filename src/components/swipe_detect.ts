export enum SWIPE {
    UP,
    DOWN,
    RIGHT,
    LEFT,
    NO_DIRECTION
}

export class UserSwipe {

    private static readonly THRESHOLD = 30; // minimum px to consider a swipe

    private startX: number | null = null;
    private startY: number | null = null;
    private startTime: number | null = null;
    private tracking = false;
    private onSwipeFn = (gesture: SWIPE): void => { };

    constructor(htmlElement: HTMLElement) {

        // TOUCH events (mobile) — passive:false so we can call preventDefault()
        htmlElement.addEventListener('touchstart', e => {
            if (!e.touches || e.touches.length === 0) return;
            const t = e.touches[0];
            this.onStart(t.clientX, t.clientY);
        }, { passive: false });

        htmlElement.addEventListener('touchmove', e => {
            // if the user has multiple touches, ignore
            if (!e.touches || e.touches.length === 0) return;
            const t = e.touches[0];
            this.onMove(t.clientX, t.clientY, e);
        }, { passive: false });

        htmlElement.addEventListener('touchend', e => {
            // touchend uses changedTouches
            if (!e.changedTouches || e.changedTouches.length === 0) return;
            const t = e.changedTouches[0];
            this.onEnd(t.clientX, t.clientY);
        }, { passive: false });

        htmlElement.addEventListener('touchcancel', () => {

            this.tracking = false;
            this.setDirection(SWIPE.NO_DIRECTION);

        }, { passive: false });

        // POINTER / MOUSE fallback for desktop
        let pointerDown = false;
        htmlElement.addEventListener('pointerdown', e => {

            if (e.isPrimary === false) return;
            pointerDown = true;
            this.onStart(e.clientX, e.clientY);

        }, { passive: false });

        htmlElement.addEventListener('pointermove', e => {

            if (!pointerDown) return;
            this.onMove(e.clientX, e.clientY, e);

        }, { passive: false });

        htmlElement.addEventListener('pointerup', e => {

            if (!pointerDown) return;
            pointerDown = false;
            this.onEnd(e.clientX, e.clientY);

        }, { passive: false });

        htmlElement.addEventListener('pointercancel', () => {

            pointerDown = false;
            this.tracking = false;
            this.setDirection(SWIPE.NO_DIRECTION);

        }, { passive: false });

        // initial state
        this.setDirection(SWIPE.NO_DIRECTION);
    }

    public onSwipe(fn: (gesture: SWIPE) => void): void {
        this.onSwipeFn = fn;
    }

    private setDirection(gesture: SWIPE): void {
        this.onSwipeFn(gesture);
    }

    private onStart(x: number, y: number): void {
        this.startX = x;
        this.startY = y;
        this.startTime = Date.now();
        this.tracking = true;
    }

    private onMove(x: number, y: number, e: Event): void {
        if (!this.tracking || !this.startX || !this.startY) return;

        const dx = x - this.startX;
        const dy = y - this.startY;

        // prevent default behavior (scroll / pull-to-refresh) while tracking
        // listener must be passive:false for this to work (we set that below)
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

    }

    private onEnd(x: number, y: number): void {
        if (
            !this.tracking ||
            this.startX === null ||
            this.startY === null ||
            !this.startTime
        ) return;

        const dx = x - this.startX;
        const dy = y - this.startY;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        const dt = Date.now() - this.startTime;

        if (Math.max(adx, ady) < UserSwipe.THRESHOLD) {
            this.setDirection(SWIPE.NO_DIRECTION);
            this.tracking = false;
            return;
        }

        if (adx > ady) {
            // horizontal
            if (dx > 0) this.setDirection(SWIPE.RIGHT); else this.setDirection(SWIPE.LEFT);
        } else {
            // vertical
            if (dy > 0) this.setDirection(SWIPE.DOWN); else this.setDirection(SWIPE.UP);
        }

        this.tracking = false;
    }

}
