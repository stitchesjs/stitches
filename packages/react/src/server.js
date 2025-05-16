import React from 'react'

/**
 * StitchesServerStyleSheet component for React 18 SSR
 * This component should be used in your server-side rendering setup
 * to properly handle styles with React 18's streaming SSR
 */
export const StitchesServerStyleSheet = ({ sheet }) => {
  // Get the CSS text from the sheet
  const cssText = sheet.toString()
  
  if (!cssText) {
    return null
  }
  
  return React.createElement(
    'style',
    {
      'data-stitches': '',
      dangerouslySetInnerHTML: { __html: cssText },
    }
  )
}

/**
 * createServerStylesHook - Creates a hook for server-side rendering with React 18
 * 
 * @param {Object} sheet - The Stitches sheet instance
 * @returns {Function} A hook that returns the StitchesServerStyleSheet component
 */
export const createServerStylesHook = (sheet) => {
  return () => {
    return React.createElement(StitchesServerStyleSheet, { sheet })
  }
}
