import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * AhmiaScraper
 * Searches the public Ahmia index for .onion mentions of a domain.
 */
export class AhmiaScraper {
  static async searchOnion(query) {
    const searchUrl = `https://ahmia.fi/search/?q=${encodeURIComponent(query)}`;
    console.log(`[AhmiaScraper] Searching for onion hits: ${searchUrl}`);

    try {
      const { data } = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const $ = cheerio.load(data);
      const results = [];

      $('li.result').each((i, element) => {
        if (i >= 5) return; // Limit to top 5 results

        const title = $(element).find('h4').text().trim();
        const snippet = $(element).find('p').text().trim();
        
        // Extract the .onion URL from the link (often it's a redirect or direct link)
        let onionUrl = $(element).find('cite').text().trim() || 'Hidden Service';
        
        // Sometimes the link is in the h4 a href
        const href = $(element).find('h4 a').attr('href');
        if (href && href.includes('search_result=')) {
          const match = href.match(/search_result=(http%3A%2F%2F[a-z2-7]+\.onion)/);
          if (match) onionUrl = decodeURIComponent(match[1]);
        }

        results.push({
          title,
          content: snippet,
          url: onionUrl,
          source: 'Ahmia Dark Web Index'
        });
      });

      console.log(`[AhmiaScraper] Found ${results.length} onion mentions.`);
      return results;

    } catch (error) {
      console.error('[AhmiaScraper] Failed to fetch dark web hits:', error.message);
      return [];
    }
  }
}
