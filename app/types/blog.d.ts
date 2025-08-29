declare global {
    interface BlogPost {
      _id: string;
      title: string;
      slug: string;
      content: string;
      image?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }
  
    interface BlogParams {
      slug: string;
    }
  }
  
  export {};