const base = "rounded-lg px-6 py-3 text-sm font-semibold text-center shadow-sm transition-colors";

export const btnPrimary = `${base} bg-blue-600 text-white hover:bg-blue-700`;
export const btnSecondary = `${base} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;

export const btnPrimarySmall = "rounded-lg px-4 py-2 text-sm font-semibold text-center transition-colors bg-blue-600 text-white hover:bg-blue-700";
export const btnSecondarySmall = "rounded-lg px-4 py-2 text-sm font-semibold text-center transition-colors border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";

export const btnPrimaryBlock = `${btnPrimary} block w-full`;
export const btnSecondaryBlock = `${btnSecondary} block w-full`;

// For buttons placed on a blue/dark background
export const btnInverse = `${base} bg-white text-blue-700 hover:bg-blue-50 px-8`;
