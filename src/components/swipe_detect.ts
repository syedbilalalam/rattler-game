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

    constructor() {

        // touch events
        window.addEventListener('touchstart', e => {
            const t = e.touches[0];
            this.onStart(t.clientX, t.clientY);
        }, { passive: true });

        window.addEventListener('touchend', e => {
            // touchend has no touches; use changedTouches
            const t = e.changedTouches[0];
            if (!t) return;
            this.onEnd(t.clientX, t.clientY);
        });

        // pointer/mouse fallback (so desktop testers can drag)
        window.addEventListener('pointerdown', e => {
            // only respond to primary button
            if (e.isPrimary === false) return;
            this.onStart(e.clientX, e.clientY);
        });

        window.addEventListener('pointerup', e => {
            this.onEnd(e.clientX, e.clientY);
        });

        // optional: cancel tracking on leave / cancel events
        window.addEventListener('touchcancel', () => {
            this.tracking = false;
            this.setDirection(SWIPE.NO_DIRECTION);
        }
        );
        window.addEventListener('pointercancel', () => {
            this.tracking = false;
            this.setDirection(SWIPE.NO_DIRECTION);
        });

        // show initial
        this.setDirection(SWIPE.NO_DIRECTION);

    }

    public onSwipe (fn: (gesture: SWIPE) => void): void {
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

    private onEnd(x: number, y: number): void {
        if (!this.startTime) return;
        if (!this.tracking || this.startX === null || this.startY === null) return;
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
