import { Tool } from './types';
import { InstagramIcon, ListIcon, RssIcon, TypeIcon, MailIcon, UserIcon, LockIcon, RedditIcon, FacebookIcon, EtsyIcon } from './components/icons';

export const TOOLS: Tool[] = [
  {
    id: 'social-post',
    title: 'Social Post',
    description: 'Create engaging social media posts for platforms like Instagram, Facebook, and Twitter.',
    icon: InstagramIcon,
    prompt: 'You are a social media manager for an artist. Write an engaging social media post for a new artwork. The artwork is described by these keywords: [KEYWORDS]. Include a call-to-action and 3-5 relevant hashtags.'
  },
  {
    id: 'product-description',
    title: 'Product Description',
    description: 'Generate compelling product descriptions that highlight key features and benefits.',
    icon: ListIcon,
    prompt: 'You are an e-commerce expert. Write a compelling product description for an art print. The artwork has these characteristics: [KEYWORDS]. Focus on the mood, style, and how it would enhance a space. Keep it to 2-3 paragraphs.'
  },
  {
    id: 'blog-post',
    title: 'Blog Post',
    description: 'Create engaging blog post content about your artwork or creative process.',
    icon: RssIcon,
    prompt: 'You are an art blogger. Write a short blog post (around 300 words) about the creative process behind a new piece of art. Use the following keywords as inspiration: [KEYWORDS]. Talk about potential inspiration, technique, and the feeling the piece evokes.'
  },
  {
    id: 'product-title',
    title: 'Product Title',
    description: 'Generate SEO-friendly and creative titles for your artwork or products.',
    icon: TypeIcon,
    prompt: 'You are an SEO specialist. Generate 5 creative and SEO-friendly titles for an artwork described by the keywords: [KEYWORDS]. Each title should be unique and under 60 characters.'
  },
  {
    id: 'new-piece-email',
    title: 'New Piece Email',
    description: 'Craft personalized email announcements for new artwork releases.',
    icon: MailIcon,
    prompt: 'You are an artist writing to your mailing list. Write a warm and exciting email announcing a new artwork. The artwork is described by: [KEYWORDS]. Mention the title of the piece (you can create one) and invite subscribers to view it on your website.'
  },
  {
    id: 'artist-statement',
    title: 'Artist Statement',
    description: 'Create professional artist statements that capture your artistic vision.',
    icon: UserIcon,
    prompt: 'You are an art curator helping an artist. Write a concise artist statement (about 150 words) based on a piece described by: [KEYWORDS]. The statement should touch on themes, style, and the artist\'s overall vision.'
  },
  {
    id: 'social-post-custom',
    title: 'Social Post (Custom)',
    description: 'Create your favorite style social post. Best used with Custom Rules.',
    icon: LockIcon,
    prompt: 'You are a social media manager with a quirky and unique voice. Write a social media post for an artwork with these keywords: [KEYWORDS]. Make it stand out from the crowd.'
  },
  {
    id: 'reddit-group-finder',
    title: 'Reddit Group Finder',
    description: 'Discover subreddits where you can share and discuss your artwork.',
    icon: RedditIcon,
    prompt: 'You are an expert on Reddit communities. Based on the keywords: [KEYWORDS], suggest 5 specific subreddits where this artwork could be shared and well-received. For each subreddit, provide a brief reason why it\'s a good fit.'
  },
  {
    id: 'facebook-group-finder',
    title: 'Facebook Group Finder',
    description: 'Find relevant Facebook groups to share and promote your artwork.',
    icon: FacebookIcon,
    prompt: 'You are an expert on Facebook communities. Based on the keywords: [KEYWORDS], suggest 5 specific types of Facebook groups where this artwork could be shared. For each type, explain why it would be a good audience.'
  },
  {
    id: 'etsy-listing-complete',
    title: 'Etsy Listing (Complete)',
    description: 'Generate a complete Etsy listing including title, description, and tags.',
    icon: EtsyIcon,
    prompt: 'You are an Etsy expert. Create a complete listing for an art print. Use the keywords: [KEYWORDS]. Provide the following sections:\n\n**Title:** (Creative and SEO-friendly)\n\n**Description:** (2-3 paragraphs describing the art and its feel)\n\n**Tags:** (13 comma-separated relevant tags)'
  },
];

export const CONTEXT_PROMPTS: string[] = [
  'Place this artwork in a thin, light-colored wooden frame on the wall of a brightly lit, minimalist living room with white walls and a simple sofa.',
  'Display this artwork on a clean white wall in a modern art gallery setting, with spotlights shining on it.',
  'Show this artwork hanging above a dark gray sofa in a contemporary, stylish apartment with large windows.',
  'Place this artwork on the brick wall of a cozy, industrial-style loft bedroom with warm, soft lighting.'
];