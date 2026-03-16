// prohibitedPhraseDetector.js

const { link } = require("fs");

class ProhibitedPhraseDetector {
  constructor() {
    // Dictionary of weird Unicode combinations that trigger timeout
    this.weirdUnicodeDict = [
      '\u200B', // Zero width space
      '\u200C', // Zero width non-joiner
      '\u200D', // Zero width joiner
      '\u2060', // Word joiner
      '\u00A0', // Non-breaking space
      '\u180E', // Mongolian vowel separator
      '\u2028', // Line separator
      '\u2029', // Paragraph separator
      '\uFEFF', // Zero width no-break space
// ⑥⑦
      '\u2465\u2466',
      '\u2465 \u2466', // Circled numbers 6 and 7
// ❻❼
      '\u277b\u277c',
      '\u277b \u277c', // Dingbat numbers 6 and 7
// ６７
      '\uFF16\uFF17',
      '\uFF16 \uFF17', // Fullwidth numbers 6 and 7
// 𝟲𝟳
      '\u1D7F2\u1D7F3',
      '\u1D7F2 \u1D7F3', // Mathematical bold digits 6 and 7
// 𝟨𝟩
      '\u1D7E8\u1D7E9',
      '\u1D7E8 \u1D7E9', // Mathematical double-struck digits 6 and 7
// 𝟞𝟟
      '\u1D7DE\u1D7DF',
      '\u1D7DE \u1D7DF', // Mathematical sans-serif digits 6 and 7
// 𝟼𝟽
      '\u1D7FC\u1D7FD',
      '\u1D7FC \u1D7FD', // Mathematical monospace digits 6 and 7
// 𝟔𝟕
      '\u1D7D4\u1D7D5',
      '\u1D7D4 \u1D7D5', // Mathematical bold sans-serif digits 6 and 7
// ⁶⁷
      '\u2076\u2077',
      '\u2076 \u2077', // Superscript 6 and 7
// ₆₇
      '\u2086\u2087',
      '\u2086 \u2087', // Subscript 6 and 7
// 𝟨𝟩
      '\u1D7E8\u1D7E9',
      '\u1D7E8 \u1D7E9', // Mathematical double-struck digits 6 and 7
// ⑹⑺
      '\u2479\u247A',
      '\u2479 \u247A', // Dingbat negative circled numbers 6 and 7
//  󠀶󠀷
      '\uE0036\uE0037',
      '\uE0036 \uE0037', // Tag characters for 6 and 7
// ６７
      '\uFF16\uFF17',
      '\uFF16 \uFF17', // Fullwidth numbers 6 and 7
// ᑳᒣ
      '\u14B3\u14A3',
      '\u14B3 \u14A3', // Canadian Aboriginal syllabics for 6 and 7
// ⠋⠛
      '\u280B\u281B',
      '\u280B \u281B', // Braille patterns for 6 and 7
// ⒍⒎
      '\u248D\u248E',
      '\u248D \u248E', // Parenthesized numbers 6 and 7
// 𐄧 𐄨
      '\u101A7\u101A8',
      '\u101A7 \u101A8', // Aegean numbers 6 and 7
// ⓺⓻
      '\u24FA\u24FB',
      '\u24FA \u24FB', // Enclosed alphanumeric supplement numbers 6 and 7
    ]
    
    // Common prohibited patterns
    this.prohibitedPatterns = ['67', '6 7', 'sixseven', 'six seven' , 's6xs7ven', 's6x s7ven'];
  }

  /**
   * Main function to detect prohibited phrases in a message
   * @param {string} message - The message to check
   * @returns {boolean} - True if prohibited phrase detected, false otherwise
   */
  detectProhibitedPhrase(message) {
    if (!message || typeof message !== 'string') {
      return false;
    }

    // Step 1: Check for weird Unicode
    if (this.hasWeirdUnicode(message)) {
      return true;
    }

    // Step 2: Remove non-alphanumeric Unicode characters
    const cleanedMessage = this.cleanMessage(message);

    // Step 3: Dumb check for exact "67" and "6 7"
    if (!this.containsProhibitedPattern(cleanedMessage)) {
      return false;
    }

    // Continue with additional checks if pattern found
    if (this.hasHttpLink(cleanedMessage) || this.hasEmojiPattern(cleanedMessage)) {
      // Continue checks if link or emoji is present
    } else {
      return true; // Timeout if no link or emoji
    }

    // Step 4: Check for links with "http://" or "https://"
    const processedMessage = this.processLinks(cleanedMessage);
    
    // Step 5: Check for emoji patterns
    const finalProcessedMessage = this.processEmoji(processedMessage);

    return false;
  }

  /**
   * Check if message contains weird Unicode combinations
   * @param {string} message - The message to check
   * @returns {boolean} - True if weird Unicode found
   */
  hasWeirdUnicode(message) {
    for (const unicodeChar of this.weirdUnicodeDict) {
      if (message.includes(unicodeChar)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clean message by removing non-alphanumeric Unicode characters
   * @param {string} message - The message to clean
   * @returns {string} - Cleaned message
   */
  cleanMessage(message) {
    // Keep only alphanumeric, special characters and basic punctuation
    return message.replace(/[^a-zA-Z0-9!@<:>.,#$%^&*()?{}[\]\\|\/\s-]/g, '');
  }

  /**
   * Check for prohibited patterns (67 or 6 7)
   * @param {string} message - The cleaned message to check
   * @returns {boolean} - True if pattern found
   */
  containsProhibitedPattern(message) {
    return this.prohibitedPatterns.some(pattern => 
      message.includes(pattern)
    );
  }

  /**
   * Check for HTTP links in the message
   * @param {string} message - The message to check
   * @returns {boolean} - True if HTTP link found
   */
  hasHttpLink(message) {
    return /https?:\/\//.test(message);
  }

  /**
   * Check for emoji patterns (starting with <: and ending with >)
   * @param {string} message - The message to check
   * @returns {boolean} - True if emoji pattern found
   */
  hasEmojiPattern(message) {
    return /(<:)|(<a:)[^>]*>/.test(message);
  }

  /**
   * Process links in the message
   * @param {string} message - The message to process
   * @returns {string} - Message with processed links
   */
  processLinks(message) {
    const httpRegex = /(https?:\/\/[^\s]+)/g;
    let result = message;
    
    let match;
    while ((match = httpRegex.exec(result)) !== null) {
      const fullLink = match[0];
      const linkStartIndex = match.index;
      
      // Find the end of the link (first space or end of string)
      const nextSpaceIndex = result.indexOf(' ', linkStartIndex);
      const endIndex = nextSpaceIndex === -1 ? result.length : nextSpaceIndex;
      
      const linkPart = result.substring(linkStartIndex, endIndex);
      
      console.log(`[LINK DETECTED]: ${fullLink}`);

      // Check if link contains prohibited patterns
      if (fullLink.includes('-67-') || fullLink.includes('-6-7-')) {  
        console.log(`[PROHIBITED LINK DETECTED]:`);
        return true; // Timeout
      }
      
      // Remove the processed link from message
      result = result.substring(0, linkStartIndex) + 
               result.substring(endIndex);
    }
    
    return result;
  }

  /**
   * Check if link contains prohibited patterns
   * @param {string} link - The link to check
   * @returns {boolean} - True if prohibited pattern found in link
   */
  // containsProhibitedPatternInLink(link) {
  //   // Check for -67-, -6-7- patterns in the link
  //   const prohibitedRegex = /-67-|-6-7-/;
  //   return prohibitedRegex.test(link);
  // }

  /**
   * Process emoji patterns in the message
   * @param {string} message - The message to process
   * @returns {string} - Message with processed emojis
   */
  processEmoji(message) {
    const emojiRegex = /<:([^>]+)>/g;
    let result = message;
    
    let match;
    while ((match = emojiRegex.exec(result)) !== null) {
      const fullEmoji = match[0];
      const emojiContent = match[1];
      
      // Check if emoji contains prohibited patterns
      if (this.containsProhibitedInEmoji(emojiContent)) {
        return true; // Timeout
      }
      
      // Remove the processed emoji from message
      result = result.replace(fullEmoji, '');
    }
    
    return result;
  }

  /**
   * Check if emoji content contains prohibited patterns
   * @param {string} emojiContent - The emoji content to check
   * @returns {boolean} - True if prohibited pattern found in emoji
   */
  containsProhibitedInEmoji(emojiContent) {
    // Check for "67" in the emoji content
    if (emojiContent.includes('67')) {
      // Find positions of colons
      const firstColonIndex = emojiContent.indexOf(':');
      const secondColonIndex = emojiContent.lastIndexOf(':');
      
      if (firstColonIndex !== -1 && secondColonIndex !== -1) {
        // Extract content between colons
        const betweenColons = emojiContent.substring(firstColonIndex + 1, secondColonIndex);
        
        // If 67 is inside the colon section, timeout
        if (betweenColons.includes('67')) {
          return true;
        }
      }
      
      // If 67 is outside colon sections, continue
      return false;
    }
    
    // Check for "6" and "7" separately in colon sections
    const firstColonIndex = emojiContent.indexOf(':');
    const secondColonIndex = emojiContent.lastIndexOf(':');
    
    if (firstColonIndex !== -1 && secondColonIndex !== -1) {
      const betweenColons = emojiContent.substring(firstColonIndex + 1, secondColonIndex);
      
      // Check for isolated "6" or "7"
      if (betweenColons.includes('6') && !betweenColons.includes('7')) {
        return false; // Continue with '6' replaced
      } else if (betweenColons.includes('7') && !betweenColons.includes('6')) {
        return false; // Continue with '7' replaced
      }
    }
    
    return false;
  }

  /**
   * Convenience method to check and return timeout status
   * @param {string} message - The message to check
   * @returns {boolean} - True if timeout should occur, false otherwise
   */
  shouldTimeout(message) {
    return this.detectProhibitedPhrase(message);
  }
}

// Export the class for use in Node.js modules
module.exports = ProhibitedPhraseDetector;
