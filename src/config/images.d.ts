declare module '@/config/images' {
  export const IMAGES: {
    hero: {
      facelessEmpire: string;
      workspaceModern: string;
      laptopSetup: string;
    };
    aiTools: {
      automation: string;
      aiTechnology: string;
      machineLearning: string;
      dataProcessing: string;
    };
    privacy: {
      anonymous: string;
      security: string;
      dataProtection: string;
      privacyScreen: string;
    };
    contentCreation: {
      microphone: string;
      camera: string;
      studio: string;
      recording: string;
      editing: string;
    };
    monetization: {
      finance: string;
      revenue: string;
      profit: string;
      business: string;
    };
    learning: {
      onlineCourse: string;
      tutorial: string;
      education: string;
      skillBuilding: string;
    };
    tools: {
      software: string;
      productivity: string;
      utilities: string;
      dashboard: string;
    };
    community: {
      networking: string;
      collaboration: string;
      social: string;
      team: string;
    };
    backgrounds: {
      gradient1: string;
      gradient2: string;
      abstract: string;
      tech: string;
    };
    fallbacks: {
      default: string;
      error: string;
      loading: string;
    };
    learningPaths: {
      workspace: Record<string, string>;
      contentCreator: Record<string, string>;
      technology: Record<string, string>;
      faceless: Record<string, string>;
    };
  };
  
  export function getImage(category: string, key: string): string;
  export function getRandomImage(category: string): string;
  export function getLearningPathImages(pathCount: number): string[];
  export declare const getArticleImage: (category?: string) => string;
  export declare const getSpecificArticleImage: (key: string) => string;
  export declare const getArticleImagesArray: (count?: number, category?: string | null) => string[];
  export default IMAGES;
}
