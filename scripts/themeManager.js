class ManifestThemeManager {
    constructor() {
        this.manifestPath = '/fullpip-notes-debugging/manifest.json';
        this.init();
    }

    init() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.updateManifestTheme(prefersDark);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.updateManifestTheme(e.matches);
        });
    }

    async updateManifestTheme(isDark) {
        const themeColor = isDark ? '#333333' : '#ffffff';
        
        try {
            const response = await fetch(this.manifestPath);
            const manifest = await response.json();
            manifest.theme_color = themeColor;

            // Create a new manifest file with updated theme
            const blob = new Blob([JSON.stringify(manifest, null, 4)], {type: 'application/json'});
            const manifestURL = URL.createObjectURL(blob);

            // Update the manifest link
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                manifestLink.href = manifestURL;
            }
        } catch (error) {
            console.error('Failed to update manifest theme:', error);
        }
    }
}