import { writable } from "svelte/store";
import { START } from "$utils/optim.js";

// Index of the slide currently shown in the carousel (0-based).
export const currentSlide = writable(0);

// The viewer's current guess for [θ₀, θ₁], shared by slides 2–4 so the line
// they set by hand carries through to the residuals and the loss landscape.
export const guess = writable([...START]);

// Which top-level tab is showing: "learn" (slides) or "playground".
export const tab = writable("learn");
