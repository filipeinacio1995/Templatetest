export interface StoreConfig {
  tebexToken: string;
  storeName: string;
  currency: string;
  
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
    };
    images: {
      logo: string;
      heroBackground: string;
    };
  };

  content: {
    heroTitle: string;
    heroSubtitle: string;
    footerText: string;
  };

  // New Configurable Sections
  announcement?: {
    enabled: boolean;
    text: string;
    link?: string;
  };

  navigation: {
    label: string;
    url: string;
    external?: boolean;
  }[];

  features: {
    enabled: boolean;
    items: {
      icon: string; // Lucide icon name
      title: string;
      subtitle: string;
    }[];
  };

  story: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      image: string;
      alignment: 'left' | 'right';
    }[];
  };

  socials: {
    discord?: string;
    twitter?: string;
    youtube?: string;
  };

  analytics?: {
    googleId?: string; // G-XXXXXXXXXX
  };
}

export const config: StoreConfig = {
  tebexToken: "w59w-2b4a1c3284e722ef0ba3eb03798b6ccbc2c3253c", 
  storeName: "Velocity Roleplay",
  currency: "EUR",
  
  analytics: {
    googleId: "G-XXXXXXXXXX", // Replace with your ID
  },

  theme: {
    colors: {
      primary: "#3b82f6",    
      secondary: "#64748b",  
      background: "#0f172a", 
      surface: "#1e293b",    
      text: "#f8fafc",       
    },
    images: {
      logo: "https://swisser.cloud/s/LzqdS3Vt",
      heroBackground: "https://swisser.cloud/s/YJvFf2Qc",
    },
  },

  content: {
    heroTitle: "Enhance Your Experience",
    heroSubtitle: "Get exclusive items, priority queue, and support the server.",
    footerText: "© 2025 Velocity Roleplay. Not affiliated with Rockstar Games.",
  },

  announcement: {
    enabled: true,
    text: "🔥 GRAND OPENING: Use code 'CRIME25' for 25% OFF all packages!",
  },

  navigation: [
    { label: "Home", url: "/" },
    { label: "Story", url: "/story" },
    { label: "Rules", url: "https://example.com/rules", external: true },
    { label: "Discord", url: "https://discord.gg", external: true },
    { label: "Status", url: "https://status.example.com", external: true },
  ],

  features: {
    enabled: true,
    items: [
      { icon: "Zap", title: "Instant Delivery", subtitle: "Automated system" },
      { icon: "ShieldCheck", title: "Secure Payment", subtitle: "SSL Encrypted" },
      { icon: "Headphones", title: "24/7 Support", subtitle: "Via Discord" },
    ],
  },

  story: {
    enabled: true,
    title: "The Velocity Story",
    subtitle: "Built by players, for players.",
    items: [
      {
        title: "Our Beginning",
        description: "Founded in 2023, Velocity Roleplay started with a simple mission: to create a GTA V roleplay experience that values storytelling above all else. We grew from a small group of friends to a thriving community.",
        image: "https://swisser.cloud/s/YJvFf2Qc", // Reusing hero bg for now
        alignment: "left",
      },
      {
        title: "The Community",
        description: "Our community is the heartbeat of the server. With over 50,000 active players, we host daily events, competitive gangs, and realistic civilian jobs. Your voice shapes our world.",
        image: "https://wallpapercave.com/wp/wp9365321.jpg", // Reusing logo (or another image if available) - kept valid url
        alignment: "right",
      },
      {
        title: "The Future",
        description: "We are constantly pushing the boundaries of FiveM. From custom scripts to exclusive vehicles, your support directly funds the development of new features and better hardware.",
        image: "https://wallpapercave.com/wp/wp9365315.jpg",
        alignment: "left",
      },
    ],
  },

  socials: {
    discord: "https://discord.gg/example",
    twitter: "https://twitter.com/example",
  },
};
