import { writable } from "svelte/store";

// Index of the slide currently shown in the carousel (0-based).
export const currentSlide = writable(0);
