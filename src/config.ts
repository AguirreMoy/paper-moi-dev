export const SITE = {
  website: "https://moi.dev/", // replace this with your deployed domain
  author: "Moises Aguirre",
  profile: "https://github.com/AguirreMoy",
  desc: "Personal blog and portfolio of Moises Aguirre, a Software Engineer based in Los Angeles.",
  title: "Moises Aguirre",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/AguirreMoy/paper-moi-dev/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Los_Angeles", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
