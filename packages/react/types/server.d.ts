import * as React from 'react'

export interface StitchesServerStyleSheetProps {
  sheet: {
    toString: () => string
  }
}

export interface ServerStylesHook {
  (): React.ReactElement | null
}

/**
 * StitchesServerStyleSheet component for React 18 SSR
 * This component should be used in your server-side rendering setup
 * to properly handle styles with React 18's streaming SSR
 */
export declare const StitchesServerStyleSheet: React.FC<StitchesServerStyleSheetProps>

/**
 * createServerStylesHook - Creates a hook for server-side rendering with React 18
 * 
 * @param sheet - The Stitches sheet instance
 * @returns A hook that returns the StitchesServerStyleSheet component
 */
export declare const createServerStylesHook: (sheet: { toString: () => string }) => ServerStylesHook
