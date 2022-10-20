import * as ColorTransform from 'src/util/ColorTransform';

export function registerAppStyles(themeManager) {
    themeManager.register('--color-graph-node', 'graph');
    themeManager.register('--color-graph-text', 'graph');
    themeManager.register('--color-graph-select', 'graph');

    themeManager.register('--color-accent', 'general');
    const colorPrimary = themeManager.register('--color-primary', 'general');
    themeManager.register('--color-primary-text', 'general');
    themeManager.register(
        '--color-primary-lite',
        'hidden',
        colorPrimary,
        ColorTransform.lite
    );
    themeManager.register(
        '--color-primary-dark',
        'hidden',
        colorPrimary,
        ColorTransform.dark
    );

    const colorBackground = themeManager.register(
        '--color-background',
        'general'
    );
    themeManager.register(
        '--color-background-active',
        'hidden',
        colorBackground,
        ColorTransform.invert
    );
    themeManager.register(
        '--color-background-lite',
        'hidden',
        colorBackground,
        ColorTransform.lite
    );

    themeManager.register('--color-success', 'general');
    themeManager.register('--color-warning', 'general');

    const colorSurface = themeManager.register('--color-surface', 'surface');
    themeManager.register('--color-surface-text', 'surface');
    themeManager.register(
        '--color-surface-active',
        'hidden',
        colorSurface,
        ColorTransform.invert
    );
    themeManager.register(
        '--color-surface-lite',
        'hidden',
        colorSurface,
        ColorTransform.lite
    );
    themeManager.register(
        '--color-surface-dark',
        'hidden',
        colorSurface,
        ColorTransform.dark
    );

    const colorSurfaceError = themeManager.register(
        '--color-surface-error',
        'surface'
    );
    themeManager.register(
        '--color-surface-error-dark',
        'hidden',
        colorSurfaceError,
        ColorTransform.dark
    );

    const colorSurfaceSuccess = themeManager.register(
        '--color-surface-success',
        'surface'
    );
    themeManager.register(
        '--color-surface-success-dark',
        'hidden',
        colorSurfaceSuccess,
        ColorTransform.dark
    );

    const colorSurfaceWarning = themeManager.register(
        '--color-surface-warning',
        'surface'
    );
    themeManager.register(
        '--color-surface-warning-dark',
        'hidden',
        colorSurfaceWarning,
        ColorTransform.dark
    );
}
