import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required.' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch URL ${url}. Status: ${response.status} ${response.statusText}`,
      );
      const responseBody = await response.text();
      console.error(
        'Response body (first 500 chars):',
        responseBody.substring(0, 500),
      );
      return NextResponse.json(
        {
          error: `Failed to fetch URL: ${response.statusText}`,
          debugInfo: responseBody.substring(0, 200),
        },
        { status: response.status },
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Open Graph (OG) meta tags
    const ogTitle = $('meta[property="og:title"]').attr('content')?.trim();
    const ogDescription = $('meta[property="og:description"]')
      .attr('content')
      ?.trim();
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogUrl = $('meta[property="og:url"]').attr('content');
    const ogSiteName = $('meta[property="og:site_name"]').attr('content');

    // Fallbacks for title and description
    const title = ogTitle || $('title').text()?.trim() || 'No Title';
    const description =
      ogDescription ||
      $('meta[name="description"]').attr('content')?.trim() ||
      'No description available.';

    // Prioritize high-quality images
    let imageUrl = ogImage;
    if (!imageUrl) {
      // Find all images and filter for high-quality ones (e.g., width > 100px or no tiny icons)
      const images = $('img')
        .map((i, el) => {
          const src = $(el).attr('src');
          const width = parseInt($(el).attr('width') || '0', 10);
          return src && (width > 100 || !src.includes('icon')) ? src : null;
        })
        .get()
        .filter(Boolean);

      imageUrl = images[0];
      if (imageUrl && !imageUrl.startsWith('http')) {
        try {
          const baseUrl = new URL(url).origin;
          imageUrl = new URL(imageUrl, baseUrl).toString();
        } catch (e) {
          imageUrl = undefined; // Ignore if URL parsing fails
        }
      }
    }

    // Extract favicon
    const favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href');
    const faviconUrl =
      favicon && !favicon.startsWith('http')
        ? new URL(favicon, url).toString()
        : favicon;

    // Use canonical URL or fallback to input URL
    const canonicalUrl =
      ogUrl || $('link[rel="canonical"]').attr('href') || url;

    // Sanitize and limit text length (WhatsApp-like previews are concise)
    const maxTitleLength = 100;
    const maxDescriptionLength = 200;
    const sanitizedTitle =
      title.length > maxTitleLength
        ? title.substring(0, maxTitleLength - 3) + '...'
        : title;
    const sanitizedDescription =
      description.length > maxDescriptionLength
        ? description.substring(0, maxDescriptionLength - 3) + '...'
        : description;

    return NextResponse.json({
      title: sanitizedTitle,
      description: sanitizedDescription,
      imageUrl: imageUrl || null,
      url: canonicalUrl,
      siteName: ogSiteName || new URL(url).hostname,
      faviconUrl: faviconUrl || null,
    });
  } catch (error) {
    console.error(`Error unfurling URL ${url}:`, error);
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message || 'Unknown error'
        : 'Unknown error';
    return NextResponse.json(
      { error: `Could not unfurl link: ${errorMessage}` },
      { status: 500 },
    );
  }
}
