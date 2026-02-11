// Free Content Creation Images from Unsplash
// All images are free for commercial use, no attribution required

export const CONTENT_CREATION_IMAGES = {
  // Workspace & Laptop Images
  workspace: {
    modernDesk: "https://unsplash.com/photos/Q4iYWsWbR90/download?force=true",
    laptopOnDesk: "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-desk-Q4iYWsWbR90/download?force=true",
    organizedWorkspace: "https://unsplash.com/photos/a-modern-organized-workspace-with-a-laptop-aN8yRTfGYXY/download?force=true",
    womanWorking: "https://unsplash.com/photos/BkwzVF6mHdc/download?force=true",
  },
  
  // Content Creation Specific
  contentCreator: {
    filming: "https://unsplash.com/photos/ziSzilQLSOM/download?force=true",
    writing: "https://unsplash.com/photos/Im7lZjxeLhg/download?force=true",
    podcasting: "https://unsplash.com/photos/m_HRfLhgABo/download?force=true",
    videoCreation: "https://unsplash.com/photos/npxXWgQ33ZQ/download?force=true",
  },
  
  // Technology & Equipment
  technology: {
    laptopSetup: "https://unsplash.com/photos/1SAnrIxw5OY/download?force=true",
    computerDesk: "https://unsplash.com/photos/RSCirJ70NDM/download?force=true",
    officeTech: "https://unsplash.com/photos/hBuwVLcYTnA/download?force=true",
    mobileDevice: "https://unsplash.com/photos/mfB1B1s4sMc/download?force=true",
  },
  
  // Faceless & Anonymous Content
  faceless: {
    anonymousCreator: "https://unsplash.com/photos/xSiQBSq-I0M/download?force=true",
    voiceRecording: "https://unsplash.com/photos/j4uuKnN43_M/download?force=true",
    screenRecording: "https://unsplash.com/photos/Hin-rzhOdWs/download?force=true",
    digitalAvatar: "https://unsplash.com/photos/mfWsMDdN-Ro/download?force=true",
  }
};

// Helper function to get random image from category
export const getRandomImage = (category: keyof typeof CONTENT_CREATION_IMAGES) => {
  const images = CONTENT_CREATION_IMAGES[category];
  const keys = Object.keys(images) as Array<keyof typeof images>;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return images[randomKey];
};

// Helper function to get specific image
export const getImage = (category: keyof typeof CONTENT_CREATION_IMAGES, key: string) => {
  return CONTENT_CREATION_IMAGES[category]?.[key as keyof typeof CONTENT_CREATION_IMAGES[typeof category]];
};
