export const initDropdowns = () => {
    document.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // Find the toggle and the parent container
        const toggle = target.closest('[data-cx-toggle="dropdown"]');
        const container = target.closest('[data-cx-dropdown]');
        const isItemClick = target.closest('.dropdown-item');

        // Handle Toggle Click
        if (toggle && container) {
            const isExpanded = container.classList.contains('show');

            // Close all other open dropdowns first
            closeAllDropdowns();

            if (!isExpanded) {
                container.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            }
            return; // Stop here
        }

        // Handle Closing (Clicking an item OR clicking outside)
        if (isItemClick || !container) {
            closeAllDropdowns();
        }
    });

    // Global "Esc" key support
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeAllDropdowns();
    });
};

function closeAllDropdowns() {
    const activeDropdowns = document.querySelectorAll('[data-cx-dropdown].show');
    activeDropdowns.forEach((dropdown) => {
        dropdown.classList.remove('show');
        dropdown.querySelector('[data-cx-toggle]')?.setAttribute('aria-expanded', 'false');
    });
}
