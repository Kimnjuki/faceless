// Free Content Creation Images from Unsplash
// All images are free for commercial use, no attribution required

type ImageCategory = {
  [key: string]: string;
};

export const CONTENT_CREATION_IMAGES: Record<string, ImageCategory> = {
  // Workspace & Laptop Images
  workspace: {
    modernDesk: "https://unsplash.com/photos/Q4iYWsWbR90/download?force=true",
    laptopOnDesk: "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-desk-Q4iYWsWbR90/download?force=true",
    organizedWorkspace: "https://unsplash.com/photos/a-modern-organized-workspace-with-a-laptop-aN8yRTfGYXY/download?force=true",
    womanWorking: "https://unsplash.com/photos/BkwzVF6mHdc/download?force=true",
    cleanSetup: "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-wooden-table-6RqSDGaNJ5c/download?force=true",
    minimalDesk: "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-table-nVqRBcNBsno/download?force=true",
    homeOffice: "https://unsplash.com/photos/a-woman-sitting-at-a-desk-working-on-a-laptop-xSiQBSq-I0M/download?force=true",
    creativeSpace: "https://unsplash.com/photos/a-laptop-computer-sitting-on-top-of-a-desk-fc1dt-T0JMI/download?force=true"
  },
  
  // Content Creation Specific
  contentCreator: {
    filming: "https://unsplash.com/photos/ziSzilQLSOM/download?force=true",
    writing: "https://unsplash.com/photos/Im7lZjxeLhg/download?force=true",
    podcasting: "https://unsplash.com/photos/m_HRfLhgABo/download?force=true",
    videoCreation: "https://unsplash.com/photos/npxXWgQ33ZQ/download?force=true",
    contentStrategy: "https://unsplash.com/photos/grUhmcZyI2U/download?force=true",
    creativeProcess: "https://unsplash.com/photos/hBuwVLcYTnA/download?force=true",
    digitalCreation: "https://unsplash.com/photos/mfB1B1s4sMc/download?force=true",
    mediaProduction: "https://unsplash.com/photos/Hin-rzhOdWs/download?force=true",
    studioSetup: "https://unsplash.com/photos/mx0GrLsckjw/download?force=true"
  },
  
  // Technology & Equipment
  technology: {
    laptopSetup: "https://unsplash.com/photos/1SAnrIxw5OY/download?force=true",
    computerDesk: "https://unsplash.com/photos/RSCirJ70NDM/download?force=true",
    officeTech: "https://unsplash.com/photos/hBuwVLcYTnA/download?force=true",
    mobileDevice: "https://unsplash.com/photos/mfB1B1s4sMc/download?force=true",
    techWorkspace: "https://unsplash.com/photos/Hcfwew744z4/download?force=true",
    digitalTools: "https://unsplash.com/photos/j4uuKnN43_M/download?force=true",
    workstation: "https://unsplash.com/photos/m_HRfLhgABo/download?force=true",
    creativeTech: "https://unsplash.com/photos/npxXWgQ33ZQ/download?force=true",
    modernTech: "https://unsplash.com/photos/hBuwVLcYTnA/download?force=true"
  },
  
  // Faceless & Anonymous Content
  faceless: {
    anonymousCreator: "https://unsplash.com/photos/xSiQBSq-I0M/download?force=true",
    voiceRecording: "https://unsplash.com/photos/j4uuKnN43_M/download?force=true",
    screenRecording: "https://unsplash.com/photos/Hin-rzhOdWs/download?force=true",
    digitalAvatar: "https://unsplash.com/photos/mfWsMDdN-Ro/download?force=true",
    anonymousWorkspace: "https://unsplash.com/photos/xSiQBSq-I0M/download?force=true",
    remoteWork: "https://unsplash.com/photos/BkwzVF6mHdc/download?force=true",
    digitalIdentity: "https://unsplash.com/photos/m_HRfLhgABo/download?force=true",
    virtualStudio: "https://unsplash.com/photos/npxXWgQ33ZQ/download?force=true",
    onlineCreation: "https://unsplash.com/photos/Hin-rzhOdWs/download?force=true"
  }
};

// Helper function to get random image from category
export const getRandomImage = (category: keyof typeof CONTENT_CREATION_IMAGES) => {
  const images = CONTENT_CREATION_IMAGES[category];
  const keys = Object.keys(images);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return images[randomKey];
};

// Helper function to get specific image
export const getImage = (category: keyof typeof CONTENT_CREATION_IMAGES, key: string) => {
  return CONTENT_CREATION_IMAGES[category]?.[key];
};

// Helper function to get diverse images for learning paths
export const getLearningPathImages = (pathCount: number) => {
  const allImages = {
    ...CONTENT_CREATION_IMAGES.workspace,
    ...CONTENT_CREATION_IMAGES.contentCreator,
    ...CONTENT_CREATION_IMAGES.technology,
    ...CONTENT_CREATION_IMAGES.faceless
  };
  
  const imageKeys = Object.keys(allImages);
  const selectedImages: string[] = [];
  
  // Ensure no duplicates and get diverse images
  for (let i = 0; i < pathCount && i < imageKeys.length; i++) {
    const randomIndex = Math.floor(Math.random() * imageKeys.length);
    const selectedImage = allImages[imageKeys[randomIndex]];
    
    if (!selectedImages.includes(selectedImage)) {
      selectedImages.push(selectedImage);
    }
  }
  
  return selectedImages;
};
