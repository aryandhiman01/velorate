export interface SlidingWindowState {
    currentCount: number;  //Current window request count
    previousCount: number;   //Previous window request count
    windowStart: number;   //Start the time of the current window
}