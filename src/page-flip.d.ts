declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, options: any);

    loadFromHTML(pages: HTMLElement[]): void;

    flipNext(): void;

    flipPrev(): void;

    turnToPage(page: number): void;

    on(eventName: string, callback: (event: any) => void): void;

    destroy(): void;
  }
}
