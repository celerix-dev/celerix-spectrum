let lastFocusedElement: HTMLElement | null = null;

export const initModals = () => {
    document.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // 1. Open Logic
        const trigger = target.closest("[data-cx-toggle='modal']");
        if (trigger) {
            const selector = trigger.getAttribute("data-cx-target");
            if (selector) {
                const modal = document.querySelector(selector) as HTMLElement;
                openModal(modal);
            }
        }

        // 2. Dismiss Logic (Close buttons or clicking the backdrop)
        const dismissTrigger = target.closest("[data-cx-dismiss='modal']");
        const isBackdropClick = target.matches("[data-cx-modal].show");

        if (dismissTrigger || isBackdropClick) {
            const modal = target.closest("[data-cx-modal]") as HTMLElement;
            closeModal(modal);
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const activeModal = document.querySelector("[data-cx-modal].show") as HTMLElement;
            if (activeModal) closeModal(activeModal);
        }
    });
};

export function openModal(modal: HTMLElement) {
    lastFocusedElement = document.activeElement as HTMLElement;
    modal.classList.add("show");
    document.body.style.overflow = "hidden"; // Scroll Lock
    modal.setAttribute("aria-hidden", "false");

    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
    focusable?.focus();
}

export function closeModal(modal: HTMLElement) {
    modal.classList.remove("show");
    if (!document.querySelector("[data-cx-modal].show")) {
        document.body.style.overflow = "";
    }
    modal.setAttribute("aria-hidden", "true");

    // Return focus to the initial trigger
    lastFocusedElement?.focus();

    modal.dispatchEvent(new CustomEvent("cx-modal-closed", { bubbles: true }));
}
