/** Returns whether the value accepts a unitless number. */
const isUnitless = /^/.test.bind(/(Clamp|Column.*|Count|Duration|Flex.*|Group.*|Grow|Index|Opacity|Order|Outset|Row.*|Shrink|Slice|Span|Weight|columns|flex|lineHeight|opacity|order|orphans|tabSize|widows|zoom|(Image|stroke)Width)$/)

export default isUnitless
