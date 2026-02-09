/**
 * Convex schema for contentanonymity.com
 * Mirrors the Supabase/PostgreSQL schema for migration.
 * Use legacyId (optional string) during import to store old UUID for mapping.
 *
 * Auth: profiles.userId is the external auth provider id (e.g. Clerk userId).
 * Timestamps: stored as number (ms since epoch) for Convex consistency.
 */
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Status/enum literals for type safety
const affiliateCommissionStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("paid"),
  v.literal("rejected")
);
const articleStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("archived")
);
const accessTier = v.union(
  v.literal("free"),
  v.literal("premium"),
  v.literal("vip")
);
const lessonType = v.union(
  v.literal("video"),
  v.literal("text"),
  v.literal("quiz"),
  v.literal("assignment")
);
const courseLevel = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced")
);
const emailSequenceType = v.union(
  v.literal("welcome"),
  v.literal("nurture"),
  v.literal("abandoned_cart"),
  v.literal("post_purchase"),
  v.literal("re_engagement")
);
const emailSubscriberStatus = v.union(
  v.literal("active"),
  v.literal("inactive"),
  v.literal("bounced"),
  v.literal("unsubscribed")
);
const forumPostType = v.union(
  v.literal("discussion"),
  v.literal("question"),
  v.literal("success_story"),
  v.literal("resource")
);
const forumPostStatus = v.union(
  v.literal("published"),
  v.literal("draft"),
  v.literal("archived")
);
const orderStatus = v.union(
  v.literal("pending"),
  v.literal("paid"),
  v.literal("failed"),
  v.literal("refunded"),
  v.literal("cancelled")
);
const productType = v.union(
  v.literal("digital"),
  v.literal("course"),
  v.literal("service"),
  v.literal("subscription"),
  v.literal("bundle")
);
const productStatus = v.union(
  v.literal("draft"),
  v.literal("active"),
  v.literal("archived")
);
const skillLevel = v.union(
  v.literal("beginner"),
  v.literal("intermediate"),
  v.literal("advanced"),
  v.literal("expert")
);
const subscriptionStatus = v.union(
  v.literal("active"),
  v.literal("canceled"),
  v.literal("past_due"),
  v.literal("unpaid")
);
const ticketPriority = v.union(
  v.literal("low"),
  v.literal("normal"),
  v.literal("high"),
  v.literal("urgent")
);
const ticketStatus = v.union(
  v.literal("open"),
  v.literal("in_progress"),
  v.literal("resolved"),
  v.literal("closed")
);
const webinarStatus = v.union(
  v.literal("scheduled"),
  v.literal("live"),
  v.literal("completed"),
  v.literal("cancelled")
);
const webinarRegistrationStatus = v.union(
  v.literal("registered"),
  v.literal("attended"),
  v.literal("no_show")
);
const platformTemplateStatus = v.union(
  v.literal("active"),
  v.literal("draft"),
  v.literal("archived")
);

export default defineSchema({
  // ---------------------------------------------------------------------------
  // Affiliate
  // ---------------------------------------------------------------------------
  affiliate_clicks: defineTable({
    legacyId: v.optional(v.string()),
    affiliateLinkId: v.optional(v.id("affiliate_links")),
    userId: v.optional(v.id("profiles")),
    ipAddress: v.optional(v.string()), // was inet
    userAgent: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    clickedAt: v.number(),
  }),

  affiliate_commissions: defineTable({
    legacyId: v.optional(v.string()),
    affiliateLinkId: v.optional(v.id("affiliate_links")),
    orderId: v.optional(v.id("orders")),
    userId: v.optional(v.id("profiles")),
    commissionAmount: v.number(),
    status: affiliateCommissionStatus,
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  }),

  affiliate_links: defineTable({
    legacyId: v.optional(v.string()),
    programId: v.optional(v.id("affiliate_programs")),
    productId: v.optional(v.id("products")),
    destinationUrl: v.string(),
    slug: v.string(),
    campaignSource: v.optional(v.string()),
    medium: v.optional(v.string()),
    createdAt: v.number(),
    ctaText: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  affiliate_programs: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    company: v.optional(v.string()),
    commissionRate: v.optional(v.number()),
    cookieDuration: v.optional(v.number()),
    status: v.optional(v.string()), // default 'active'
    termsUrl: v.optional(v.string()),
    createdAt: v.number(),
    productCategory: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    qualityScore: v.optional(v.number()),
    updatedAt: v.number(),
  }),

  // ---------------------------------------------------------------------------
  // Articles & content
  // ---------------------------------------------------------------------------
  article_related: defineTable({
    articleId: v.id("articles"),
    relatedArticleId: v.id("articles"),
    manualRank: v.optional(v.number()),
  }).index("by_article", ["articleId"]).index("by_article_related", ["articleId", "relatedArticleId"]),

  article_tags: defineTable({
    legacyId: v.optional(v.string()),
    articleId: v.optional(v.id("articles")),
    tag: v.string(),
    createdAt: v.number(),
  })
    .index("by_article", ["articleId"])
    .index("by_tag", ["tag"]),

  articles: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    content: v.string(),
    categoryId: v.optional(v.id("content_categories")),
    authorId: v.optional(v.id("profiles")),
    status: articleStatus,
    featuredImage: v.optional(v.string()),
    readTime: v.optional(v.number()),
    wordCount: v.optional(v.number()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    schemaMarkup: v.optional(v.any()),
    internalLinks: v.optional(v.any()),
    contentUpgrades: v.optional(v.any()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    viewCount: v.optional(v.number()),
    shareCount: v.optional(v.number()),
    targetPlatforms: v.optional(v.array(v.string())),
  })
    .index("by_slug", ["slug"])
    .index("by_legacyId", ["legacyId"])
    .index("by_status", ["status"])
    .index("by_category", ["categoryId"])
    .index("by_author", ["authorId"])
    .index("by_published_at", ["status", "publishedAt"])
    .index("by_category_status", ["categoryId", "status"])
    .index("by_category_status_published", ["categoryId", "status", "publishedAt"]),

  community_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    accessTier: accessTier,
    sortOrder: v.optional(v.number()),
    createdAt: v.number(),
  }),

  content_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("content_categories")),
    pillarPage: v.optional(v.boolean()),
    seoKeywords: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentId"]),

  content_tools: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    category: v.string(),
    description: v.string(),
    keyFeatures: v.optional(v.array(v.string())),
    orderIndex: v.number(),
  }).index("by_name", ["name"]),

  conversions: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    conversionType: v.string(),
    source: v.optional(v.string()),
    campaign: v.optional(v.string()),
    medium: v.optional(v.string()),
    revenue: v.optional(v.number()),
    convertedAt: v.number(),
  }),

  // ---------------------------------------------------------------------------
  // Courses & learning
  // ---------------------------------------------------------------------------
  course_lessons: defineTable({
    legacyId: v.optional(v.string()),
    moduleId: v.optional(v.id("course_modules")),
    title: v.string(),
    content: v.optional(v.any()),
    lessonType: v.optional(lessonType),
    duration: v.optional(v.number()),
    videoUrl: v.optional(v.string()),
    downloadableResources: v.optional(v.array(v.string())),
    sortOrder: v.number(),
    createdAt: v.number(),
  }).index("by_module", ["moduleId"]),

  course_modules: defineTable({
    legacyId: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    title: v.string(),
    description: v.optional(v.string()),
    sortOrder: v.number(),
    dripDelay: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_course", ["courseId"]),

  courses: defineTable({
    legacyId: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    instructorId: v.optional(v.id("profiles")),
    level: v.optional(courseLevel),
    estimatedDuration: v.optional(v.number()),
    certificateAvailable: v.optional(v.boolean()),
    completionCriteria: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_instructor", ["instructorId"]),

  digital_assets: defineTable({
    legacyId: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.optional(v.number()),
    version: v.optional(v.string()),
    accessUrl: v.optional(v.string()),
    accessExpires: v.optional(v.number()),
    watermarkData: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_product", ["productId"]),

  // ---------------------------------------------------------------------------
  // Email
  // ---------------------------------------------------------------------------
  email_campaigns: defineTable({
    legacyId: v.optional(v.string()),
    sequenceId: v.optional(v.id("email_sequences")),
    subject: v.string(),
    content: v.string(),
    sortOrder: v.optional(v.number()),
    conditions: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_sequence", ["sequenceId"]),

  email_sequences: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    type: v.optional(emailSequenceType),
    triggerEvent: v.optional(v.string()),
    waitTime: v.optional(v.number()),
    active: v.optional(v.boolean()),
    createdAt: v.number(),
  }),

  email_subscribers: defineTable({
    legacyId: v.optional(v.string()),
    email: v.string(),
    profileId: v.optional(v.id("profiles")),
    source: v.optional(v.string()),
    leadMagnetId: v.optional(v.id("lead_magnets")),
    status: emailSubscriberStatus,
    segments: v.optional(v.any()),
    customFields: v.optional(v.any()),
    subscribedAt: v.number(),
    unsubscribedAt: v.optional(v.number()),
    lastEngaged: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // ---------------------------------------------------------------------------
  // Forum / community
  // ---------------------------------------------------------------------------
  forum_posts: defineTable({
    legacyId: v.optional(v.string()),
    categoryId: v.optional(v.id("community_categories")),
    authorId: v.optional(v.id("profiles")),
    title: v.string(),
    content: v.string(),
    postType: forumPostType,
    pinned: v.optional(v.boolean()),
    status: forumPostStatus,
    viewCount: v.optional(v.number()),
    replyCount: v.optional(v.number()),
    lastReplyAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_author", ["authorId"])
    .index("by_status", ["status"]),

  lead_magnets: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    tier: v.optional(v.string()),
    type: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    deliverySequence: v.optional(v.any()),
    conversionGoal: v.optional(v.string()),
    optinFormCopy: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // ---------------------------------------------------------------------------
  // Learning paths & modules
  // ---------------------------------------------------------------------------
  learning_modules: defineTable({
    legacyId: v.optional(v.string()),
    learningPathId: v.optional(v.id("learning_paths")),
    title: v.string(),
    description: v.optional(v.string()),
    contentType: v.optional(v.string()),
    contentUrl: v.optional(v.string()),
    durationMinutes: v.optional(v.number()),
    orderIndex: v.optional(v.number()),
    prerequisites: v.optional(v.array(v.string())),
    createdAt: v.number(),
    moduleGroup: v.optional(v.string()),
    learningObjectives: v.optional(v.array(v.string())),
  }).index("by_learning_path", ["learningPathId"]),

  learning_path_modules: defineTable({
    legacyId: v.optional(v.string()),
    levelOrder: v.number(),
    levelTitle: v.string(),
    moduleOrder: v.number(),
    moduleTitle: v.string(),
    coreGoal: v.optional(v.string()),
    keyConcepts: v.optional(v.array(v.string())),
  }),

  learning_paths: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    trackType: v.string(),
    description: v.optional(v.string()),
    estimatedDuration: v.optional(v.string()),
    difficultyLevel: v.optional(v.string()),
    orderIndex: v.optional(v.number()),
    createdAt: v.number(),
  }),

  // ---------------------------------------------------------------------------
  // Niches
  // ---------------------------------------------------------------------------
  niche_analysis: defineTable({
    legacyId: v.optional(v.string()),
    nicheName: v.string(),
    category: v.string(),
    avgRpm: v.optional(v.number()),
    startupCost: v.optional(v.string()),
    productionDifficulty: v.optional(v.string()),
    timeToMonetization: v.optional(v.string()),
    evergreenScore: v.optional(v.number()),
    competitionLevel: v.optional(v.string()),
    estimatedEarningsRange: v.optional(v.string()),
    bestAiTools: v.optional(v.array(v.string())),
    risks: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  niche_case_studies: defineTable({
    legacyId: v.optional(v.string()),
    nicheId: v.optional(v.id("niches")),
    channelName: v.string(),
    subscribersCount: v.optional(v.number()),
    monthlyViews: v.optional(v.number()),
    estimatedEarnings: v.optional(v.number()),
    contentStyle: v.optional(v.string()),
    keySuccessFactors: v.optional(v.array(v.string())),
    toolsUsed: v.optional(v.array(v.string())),
    createdAt: v.number(),
  }).index("by_niche", ["nicheId"]),

  niche_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  niche_content_ideas: defineTable({
    legacyId: v.optional(v.string()),
    nicheId: v.optional(v.id("niches")),
    contentTitle: v.string(),
    contentFormat: v.optional(v.string()),
    estimatedProductionTime: v.optional(v.string()),
    requiredTools: v.optional(v.array(v.string())),
    seoPotential: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_niche", ["nicheId"]),

  niches: defineTable({
    legacyId: v.optional(v.string()),
    nicheName: v.string(),
    categoryId: v.optional(v.id("niche_categories")),
    profitabilityScore: v.optional(v.number()),
    avgRpm: v.optional(v.number()),
    difficultyLevel: v.optional(v.string()),
    competitionLevel: v.optional(v.string()),
    startupCost: v.optional(v.string()),
    timeToMonetization: v.optional(v.string()),
    evergreenScore: v.optional(v.number()),
    estimatedEarningsRange: v.optional(v.string()),
    requiredTools: v.optional(v.array(v.string())),
    bestAiTools: v.optional(v.array(v.string())),
    risks: v.optional(v.array(v.string())),
    trendStatus: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    targetAudience: v.optional(v.string()),
    primaryContentFocus: v.optional(v.string()),
    monetizationStrategies: v.optional(v.any()),
  })
    .index("by_niche_name", ["nicheName"])
    .index("by_category", ["categoryId"]),

  // ---------------------------------------------------------------------------
  // Orders & products
  // ---------------------------------------------------------------------------
  order_items: defineTable({
    legacyId: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    productId: v.optional(v.id("products")),
    variantId: v.optional(v.id("product_variants")),
    quantity: v.optional(v.number()),
    unitPrice: v.number(),
    totalPrice: v.number(),
    createdAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_product", ["productId"]),

  orders: defineTable({
    legacyId: v.optional(v.string()),
    orderNumber: v.string(),
    userId: v.optional(v.id("profiles")),
    totalAmount: v.number(),
    currency: v.optional(v.string()),
    status: orderStatus,
    paymentGateway: v.optional(v.string()),
    paymentIntentId: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
    billingAddress: v.optional(v.any()),
    taxAmount: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order_number", ["orderNumber"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  page_views: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    pagePath: v.string(),
    pageTitle: v.optional(v.string()),
    referrer: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    deviceType: v.optional(v.string()),
    country: v.optional(v.string()),
    timeOnPage: v.optional(v.number()),
    viewedAt: v.number(),
  }).index("by_user", ["userId"]),

  platform_content_templates: defineTable({
    legacyId: v.optional(v.string()),
    templateName: v.string(),
    primaryStyle: v.string(),
    targetPlatforms: v.array(v.string()),
    growthMechanism: v.optional(v.string()),
    visualPlan: v.any(),
    audioNotes: v.optional(v.string()),
    exampleApplications: v.optional(v.any()),
    status: platformTemplateStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]),

  platform_guides: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    slug: v.string(),
    platform: v.string(),
    category: v.optional(v.string()),
    content: v.string(),
    excerpt: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    authorId: v.optional(v.id("profiles")),
    difficultyLevel: v.optional(v.string()),
    readTime: v.optional(v.number()),
    viewCount: v.optional(v.number()),
    published: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    toolTags: v.optional(v.array(v.string())),
    exampleApplications: v.optional(v.any()),
  })
    .index("by_slug", ["slug"])
    .index("by_platform", ["platform"])
    .index("by_author", ["authorId"]),

  post_replies: defineTable({
    legacyId: v.optional(v.string()),
    postId: v.optional(v.id("forum_posts")),
    authorId: v.optional(v.id("profiles")),
    content: v.string(),
    parentReplyId: v.optional(v.id("post_replies")),
    upvoteCount: v.optional(v.number()),
    isSolution: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  post_upvotes: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    postId: v.optional(v.id("forum_posts")),
    replyId: v.optional(v.id("post_replies")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"]),

  product_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  product_variants: defineTable({
    legacyId: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    name: v.string(),
    price: v.number(),
    sku: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_sku", ["sku"]),

  products: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    type: v.optional(productType),
    categoryId: v.optional(v.id("product_categories")),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    subscriptionInterval: v.optional(v.string()),
    trialPeriodDays: v.optional(v.number()),
    featuredImage: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    features: v.optional(v.any()),
    requirements: v.optional(v.any()),
    targetAudience: v.optional(v.string()),
    profitMargin: v.optional(v.number()),
    status: productStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_status", ["status"]),

  // ---------------------------------------------------------------------------
  // Profiles (auth: userId = Clerk or Auth0 user id)
  // ---------------------------------------------------------------------------
  profiles: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.string(), // External auth provider id (e.g. Clerk)
    email: v.string(),
    fullName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    skillLevel: v.optional(skillLevel),
    primaryNiche: v.optional(v.string()),
    subscriptionTier: accessTier,
    emailVerified: v.optional(v.boolean()),
    marketingConsent: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastLogin: v.optional(v.number()),
    lifetimeValue: v.optional(v.number()),
    totalPurchases: v.optional(v.number()),
    websiteUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    companyName: v.optional(v.string()),
    socialLinks: v.optional(v.any()),
    credentials: v.optional(v.array(v.string())),
    knowsAbout: v.optional(v.array(v.string())),
    verifiedExpert: v.optional(v.boolean()),
  })
    .index("by_user_id", ["userId"])
    .index("by_email", ["email"]),

  student_progress: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("course_lessons")),
    completed: v.optional(v.boolean()),
    progressPercentage: v.optional(v.number()),
    lastAccessed: v.number(),
    timeSpent: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"]),

  subscriptions: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    productId: v.optional(v.id("products")),
    status: subscriptionStatus,
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"]),

  support_tickets: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    subject: v.string(),
    description: v.string(),
    priority: ticketPriority,
    status: ticketStatus,
    assignedTo: v.optional(v.id("profiles")),
    productId: v.optional(v.id("products")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  template_tools: defineTable({
    legacyId: v.optional(v.string()),
    templateId: v.id("platform_content_templates"),
    toolId: v.id("tools"),
    toolPurpose: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_template", ["templateId"])
    .index("by_tool", ["toolId"]),

  templates: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    platform: v.optional(v.string()),
    niche: v.optional(v.string()),
    type: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    previewUrl: v.optional(v.string()),
    downloadUrl: v.string(),
    fileFormat: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    downloadCount: v.optional(v.number()),
    rating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  ticket_replies: defineTable({
    legacyId: v.optional(v.string()),
    ticketId: v.optional(v.id("support_tickets")),
    authorId: v.optional(v.id("profiles")),
    content: v.string(),
    internalNote: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_ticket", ["ticketId"]),

  tool_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  tools: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    categoryId: v.optional(v.id("tool_categories")),
    description: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    pricing: v.optional(v.string()),
    pricingUrl: v.optional(v.string()),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
    bestFor: v.optional(v.string()),
    rating: v.optional(v.number()),
    ratingCount: v.optional(v.number()),
    tutorialUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["categoryId"]),

  user_affiliate_clicks: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    affiliateLinkId: v.optional(v.id("affiliate_links")),
    clickedAt: v.number(),
    converted: v.optional(v.boolean()),
    conversionValue: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_affiliate_link", ["affiliateLinkId"]),

  user_events: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    eventType: v.string(),
    eventData: v.optional(v.any()),
    sessionId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  user_learning_progress: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("course_lessons")),
    learningPathId: v.optional(v.id("learning_paths")),
    moduleId: v.optional(v.id("learning_modules")),
    completed: v.optional(v.boolean()),
    progressPercentage: v.optional(v.number()),
    lastAccessed: v.number(),
    timeSpent: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_learning_path", ["learningPathId"]),

  webinar_registrations: defineTable({
    legacyId: v.optional(v.string()),
    webinarId: v.optional(v.id("webinars")),
    userId: v.optional(v.id("profiles")),
    status: webinarRegistrationStatus,
    registeredAt: v.number(),
    attendedAt: v.optional(v.number()),
  })
    .index("by_webinar", ["webinarId"])
    .index("by_user", ["userId"]),

  webinars: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    hostId: v.optional(v.id("profiles")),
    scheduledAt: v.number(),
    duration: v.optional(v.number()),
    maxAttendees: v.optional(v.number()),
    platform: v.optional(v.string()),
    joinUrl: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    status: webinarStatus,
    createdAt: v.number(),
  })
    .index("by_host", ["hostId"])
    .index("by_status", ["status"]),

  // ---------------------------------------------------------------------------
  // News Agency Ingestion (NewsAPI / Reuters etc.)
  // ---------------------------------------------------------------------------
  content: defineTable({
    externalId: v.string(),
    source: v.string(),
    isAutomated: v.boolean(),
    originalUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    publishedAt: v.number(),
    niche: v.optional(v.string()),
    agencyCategory: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_publishedAt", ["publishedAt"]),
});
