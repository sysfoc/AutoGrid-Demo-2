// lib/social-icons.js
// This file centralizes all available predefined social media icons and their properties.
// It exports a list of platforms, a map for dynamic component lookup,
// and a list of icon names for dropdowns.

// Font Awesome 5 icons (react-icons/fa)
import { 
  FaFacebookSquare,
  FaYoutube,
  FaInstagram,
  FaPinterest,
  FaLinkedin,
  FaSnapchatGhost,
  FaReddit,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSpotify,
  FaTwitch,
  FaVimeo,
  FaSlack,
  FaSkype,
  FaTumblr,
  FaFlickr,
  FaSoundcloud,
  FaBehance,
  FaDribbble,
  FaGithub,
  FaCodepen,
  FaMedium,
  FaQuora,
  FaViber,
  FaLine,
  FaWeibo,
  FaWeixin
} from "react-icons/fa"

// Font Awesome 6 icons (react-icons/fa6)
import { 
  FaTiktok,
  FaXTwitter
} from "react-icons/fa6"

// Simple Icons (react-icons/si)
import { SiGiphy } from "react-icons/si"

// Define all available social media platforms with their icon component,
// a unique string name (matching the component name), a display name,
// and styling properties.
export const allSocialPlatforms = [
  {
    icon: FaFacebookSquare,
    name: "FaFacebookSquare",
    displayName: "Facebook",
    color: "from-blue-600 to-blue-700",
    textColor: "text-blue-600",
  },
  {
    icon: FaYoutube,
    name: "FaYoutube",
    displayName: "Youtube",
    color: "from-red-600 to-red-700",
    textColor: "text-red-600",
  },
  {
    icon: FaInstagram,
    name: "FaInstagram",
    displayName: "Instagram",
    color: "from-pink-500 to-purple-600",
    textColor: "text-pink-500",
  },
  {
    icon: FaXTwitter,
    name: "FaXTwitter",
    displayName: "Twitter",
    color: "from-gray-800 to-black",
    textColor: "text-black dark:text-white",
  },
  {
    icon: FaTiktok,
    name: "FaTiktok",
    displayName: "Tiktok",
    color: "from-black to-gray-800",
    textColor: "text-black dark:text-white",
  },
  {
    icon: SiGiphy,
    name: "SiGiphy",
    displayName: "Giphy",
    color: "from-green-500 to-teal-600",
    textColor: "text-green-500",
  },
  {
    icon: FaPinterest,
    name: "FaPinterest",
    displayName: "Pinterest",
    color: "from-red-500 to-red-600",
    textColor: "text-red-500",
  },
  {
    icon: FaLinkedin,
    name: "FaLinkedin",
    displayName: "LinkedIn",
    color: "from-blue-700 to-blue-800",
    textColor: "text-blue-700",
  },
  {
    icon: FaSnapchatGhost,
    name: "FaSnapchatGhost",
    displayName: "Snapchat",
    color: "from-yellow-400 to-yellow-500",
    textColor: "text-yellow-400",
  },
  {
    icon: FaReddit,
    name: "FaReddit",
    displayName: "Reddit",
    color: "from-orange-600 to-orange-700",
    textColor: "text-orange-600",
  },
  {
    icon: FaWhatsapp,
    name: "FaWhatsapp",
    displayName: "WhatsApp",
    color: "from-green-600 to-green-700",
    textColor: "text-green-600",
  },
  {
    icon: FaTelegram,
    name: "FaTelegram",
    displayName: "Telegram",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-500",
  },
  {
    icon: FaDiscord,
    name: "FaDiscord",
    displayName: "Discord",
    color: "from-indigo-600 to-indigo-700",
    textColor: "text-indigo-600",
  },
  {
    icon: FaSpotify,
    name: "FaSpotify",
    displayName: "Spotify",
    color: "from-green-500 to-green-600",
    textColor: "text-green-500",
  },
  {
    icon: FaTwitch,
    name: "FaTwitch",
    displayName: "Twitch",
    color: "from-purple-600 to-purple-700",
    textColor: "text-purple-600",
  },
  {
    icon: FaVimeo,
    name: "FaVimeo",
    displayName: "Vimeo",
    color: "from-blue-600 to-blue-700",
    textColor: "text-blue-600",
  },
  {
    icon: FaSlack,
    name: "FaSlack",
    displayName: "Slack",
    color: "from-purple-600 to-pink-600",
    textColor: "text-purple-600",
  },
  {
    icon: FaSkype,
    name: "FaSkype",
    displayName: "Skype",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-500",
  },
  {
    icon: FaTumblr,
    name: "FaTumblr",
    displayName: "Tumblr",
    color: "from-blue-800 to-indigo-900",
    textColor: "text-blue-800",
  },
  {
    icon: FaFlickr,
    name: "FaFlickr",
    displayName: "Flickr",
    color: "from-pink-600 to-purple-700",
    textColor: "text-pink-600",
  },
  {
    icon: FaSoundcloud,
    name: "FaSoundcloud",
    displayName: "SoundCloud",
    color: "from-orange-500 to-orange-600",
    textColor: "text-orange-500",
  },
  {
    icon: FaBehance,
    name: "FaBehance",
    displayName: "Behance",
    color: "from-blue-600 to-blue-700",
    textColor: "text-blue-600",
  },
  {
    icon: FaDribbble,
    name: "FaDribbble",
    displayName: "Dribbble",
    color: "from-pink-600 to-pink-700",
    textColor: "text-pink-600",
  },
  {
    icon: FaGithub,
    name: "FaGithub",
    displayName: "GitHub",
    color: "from-gray-800 to-gray-900",
    textColor: "text-gray-800 dark:text-gray-300",
  },
  {
    icon: FaCodepen,
    name: "FaCodepen",
    displayName: "CodePen",
    color: "from-gray-800 to-black",
    textColor: "text-gray-800 dark:text-gray-300",
  },
  {
    icon: FaMedium,
    name: "FaMedium",
    displayName: "Medium",
    color: "from-gray-800 to-gray-900",
    textColor: "text-gray-800 dark:text-gray-300",
  },
  {
    icon: FaQuora,
    name: "FaQuora",
    displayName: "Quora",
    color: "from-red-600 to-red-700",
    textColor: "text-red-600",
  },
  {
    icon: FaViber,
    name: "FaViber",
    displayName: "Viber",
    color: "from-purple-600 to-purple-700",
    textColor: "text-purple-600",
  },
  {
    icon: FaLine,
    name: "FaLine",
    displayName: "Line",
    color: "from-green-500 to-green-600",
    textColor: "text-green-500",
  },
  {
    icon: FaWeibo,
    name: "FaWeibo",
    displayName: "Weibo",
    color: "from-red-600 to-red-700",
    textColor: "text-red-600",
  },
  {
    icon: FaWeixin,
    name: "FaWeixin",
    displayName: "WeChat",
    color: "from-green-600 to-green-700",
    textColor: "text-green-600",
  },
]

// Create a map for easy lookup of icon components by their string name.
export const iconComponentsMap = allSocialPlatforms.reduce((acc, platform) => {
  acc[platform.name] = platform.icon
  return acc
}, {})

// Create a list of icon names and display names for use in dropdowns.
export const availableIconOptions = allSocialPlatforms.map((platform) => ({
  name: platform.name,
  displayName: platform.displayName,
}))