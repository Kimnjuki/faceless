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
    clickedAt: v.float64(),
  }),

  affiliate_commissions: defineTable({
    legacyId: v.optional(v.string()),
    affiliateLinkId: v.optional(v.id("affiliate_links")),
    orderId: v.optional(v.id("orders")),
    userId: v.optional(v.id("profiles")),
    commissionAmount: v.float64(),
    status: affiliateCommissionStatus,
    paidAt: v.optional(v.float64()),
    createdAt: v.float64(),
  }),

  affiliate_links: defineTable({
    legacyId: v.optional(v.string()),
    programId: v.optional(v.id("affiliate_programs")),
    productId: v.optional(v.id("products")),
    destinationUrl: v.string(),
    slug: v.string(),
    campaignSource: v.optional(v.string()),
    medium: v.optional(v.string()),
    createdAt: v.float64(),
    ctaText: v.optional(v.string()),
  })
    .index("by_slug", ["slug"]),

  affiliate_programs: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    company: v.optional(v.string()),
    commissionRate: v.optional(v.float64()),
    cookieDuration: v.optional(v.float64()),
    status: v.optional(v.string()), // default 'active'
    termsUrl: v.optional(v.string()),
    createdAt: v.float64(),
    productCategory: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    qualityScore: v.optional(v.float64()),
    updatedAt: v.float64(),
  }),

  // ---------------------------------------------------------------------------
  // Articles & content
  // ---------------------------------------------------------------------------
  article_related: defineTable({
    articleId: v.id("articles"),
    relatedArticleId: v.id("articles"),
    manualRank: v.optional(v.float64()),
  }).index("by_article", ["articleId"]).index("by_article_related", ["articleId", "relatedArticleId"]),

  article_tags: defineTable({
    legacyId: v.optional(v.string()),
    articleId: v.optional(v.id("articles")),
    tag: v.string(),
    createdAt: v.float64(),
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
    readTime: v.optional(v.float64()),
    wordCount: v.optional(v.float64()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    schemaMarkup: v.optional(v.any()),
    internalLinks: v.optional(v.any()),
    contentUpgrades: v.optional(v.any()),
    publishedAt: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
    viewCount: v.optional(v.float64()),
    shareCount: v.optional(v.float64()),
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
    sortOrder: v.optional(v.float64()),
    createdAt: v.float64(),
  }),

  content_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("content_categories")),
    pillarPage: v.optional(v.boolean()),
    seoKeywords: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.float64()),
    createdAt: v.float64(),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentId"]),

  content_tools: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    category: v.string(),
    description: v.string(),
    keyFeatures: v.optional(v.array(v.string())),
    orderIndex: v.float64(),
  }).index("by_name", ["name"]),

  conversions: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    conversionType: v.string(),
    source: v.optional(v.string()),
    campaign: v.optional(v.string()),
    medium: v.optional(v.string()),
    revenue: v.optional(v.float64()),
    convertedAt: v.float64(),
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
    duration: v.optional(v.float64()),
    videoUrl: v.optional(v.string()),
    downloadableResources: v.optional(v.array(v.string())),
    sortOrder: v.float64(),
    createdAt: v.float64(),
  }).index("by_module", ["moduleId"]),

  course_modules: defineTable({
    legacyId: v.optional(v.string()),
    courseId: v.optional(v.id("courses")),
    title: v.string(),
    description: v.optional(v.string()),
    sortOrder: v.float64(),
    dripDelay: v.optional(v.float64()),
    createdAt: v.float64(),
  }).index("by_course", ["courseId"]),

  courses: defineTable({
    legacyId: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    instructorId: v.optional(v.id("profiles")),
    level: v.optional(courseLevel),
    estimatedDuration: v.optional(v.float64()),
    certificateAvailable: v.optional(v.boolean()),
    completionCriteria: v.optional(v.any()),
    createdAt: v.float64(),
  })
    .index("by_product", ["productId"])
    .index("by_instructor", ["instructorId"]),

  digital_assets: defineTable({
    legacyId: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    fileName: v.string(),
    fileUrl: v.string(),
    fileSize: v.optional(v.float64()),
    version: v.optional(v.string()),
    accessUrl: v.optional(v.string()),
    accessExpires: v.optional(v.float64()),
    watermarkData: v.optional(v.any()),
    createdAt: v.float64(),
  }).index("by_product", ["productId"]),

  // ---------------------------------------------------------------------------
  // Email
  // ---------------------------------------------------------------------------
  email_campaigns: defineTable({
    legacyId: v.optional(v.string()),
    sequenceId: v.optional(v.id("email_sequences")),
    subject: v.string(),
    content: v.string(),
    sortOrder: v.optional(v.float64()),
    conditions: v.optional(v.any()),
    createdAt: v.float64(),
  }).index("by_sequence", ["sequenceId"]),

  email_sequences: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    type: v.optional(emailSequenceType),
    triggerEvent: v.optional(v.string()),
    waitTime: v.optional(v.float64()),
    active: v.optional(v.boolean()),
    createdAt: v.float64(),
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
    subscribedAt: v.float64(),
    unsubscribedAt: v.optional(v.float64()),
    lastEngaged: v.optional(v.float64()),
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
    viewCount: v.optional(v.float64()),
    replyCount: v.optional(v.float64()),
    lastReplyAt: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    durationMinutes: v.optional(v.float64()),
    orderIndex: v.optional(v.float64()),
    prerequisites: v.optional(v.array(v.string())),
    createdAt: v.float64(),
    moduleGroup: v.optional(v.string()),
    learningObjectives: v.optional(v.array(v.string())),
  }).index("by_learning_path", ["learningPathId"]),

  learning_path_modules: defineTable({
    legacyId: v.optional(v.string()),
    levelOrder: v.float64(),
    levelTitle: v.string(),
    moduleOrder: v.float64(),
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
    orderIndex: v.optional(v.float64()),
    createdAt: v.float64(),
  }),

  // ---------------------------------------------------------------------------
  // Niches
  // ---------------------------------------------------------------------------
  niche_analysis: defineTable({
    legacyId: v.optional(v.string()),
    nicheName: v.string(),
    category: v.string(),
    avgRpm: v.optional(v.float64()),
    startupCost: v.optional(v.string()),
    productionDifficulty: v.optional(v.string()),
    timeToMonetization: v.optional(v.string()),
    evergreenScore: v.optional(v.float64()),
    competitionLevel: v.optional(v.string()),
    estimatedEarningsRange: v.optional(v.string()),
    bestAiTools: v.optional(v.array(v.string())),
    risks: v.optional(v.array(v.string())),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }),

  niche_case_studies: defineTable({
    legacyId: v.optional(v.string()),
    nicheId: v.optional(v.id("niches")),
    channelName: v.string(),
    subscribersCount: v.optional(v.float64()),
    monthlyViews: v.optional(v.float64()),
    estimatedEarnings: v.optional(v.float64()),
    contentStyle: v.optional(v.string()),
    keySuccessFactors: v.optional(v.array(v.string())),
    toolsUsed: v.optional(v.array(v.string())),
    createdAt: v.float64(),
  }).index("by_niche", ["nicheId"]),

  niche_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_name", ["name"]),

  niche_content_ideas: defineTable({
    legacyId: v.optional(v.string()),
    nicheId: v.optional(v.id("niches")),
    contentTitle: v.string(),
    contentFormat: v.optional(v.string()),
    estimatedProductionTime: v.optional(v.string()),
    requiredTools: v.optional(v.array(v.string())),
    seoPotential: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_niche", ["nicheId"]),

  niches: defineTable({
    legacyId: v.optional(v.string()),
    nicheName: v.string(),
    categoryId: v.optional(v.id("niche_categories")),
    profitabilityScore: v.optional(v.float64()),
    avgRpm: v.optional(v.float64()),
    difficultyLevel: v.optional(v.string()),
    competitionLevel: v.optional(v.string()),
    startupCost: v.optional(v.string()),
    timeToMonetization: v.optional(v.string()),
    evergreenScore: v.optional(v.float64()),
    estimatedEarningsRange: v.optional(v.string()),
    requiredTools: v.optional(v.array(v.string())),
    bestAiTools: v.optional(v.array(v.string())),
    risks: v.optional(v.array(v.string())),
    trendStatus: v.optional(v.string()),
    description: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    quantity: v.optional(v.float64()),
    unitPrice: v.float64(),
    totalPrice: v.float64(),
    createdAt: v.float64(),
  })
    .index("by_order", ["orderId"])
    .index("by_product", ["productId"]),

  orders: defineTable({
    legacyId: v.optional(v.string()),
    orderNumber: v.string(),
    userId: v.optional(v.id("profiles")),
    totalAmount: v.float64(),
    currency: v.optional(v.string()),
    status: orderStatus,
    paymentGateway: v.optional(v.string()),
    paymentIntentId: v.optional(v.string()),
    billingEmail: v.optional(v.string()),
    billingAddress: v.optional(v.any()),
    taxAmount: v.optional(v.float64()),
    discountAmount: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    timeOnPage: v.optional(v.float64()),
    viewedAt: v.float64(),
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
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    readTime: v.optional(v.float64()),
    viewCount: v.optional(v.float64()),
    published: v.optional(v.boolean()),
    publishedAt: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    upvoteCount: v.optional(v.float64()),
    isSolution: v.optional(v.boolean()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  post_upvotes: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    postId: v.optional(v.id("forum_posts")),
    replyId: v.optional(v.id("post_replies")),
    createdAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_post", ["postId"]),

  product_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    sortOrder: v.optional(v.float64()),
    createdAt: v.float64(),
  }).index("by_slug", ["slug"]),

  product_variants: defineTable({
    legacyId: v.optional(v.string()),
    productId: v.optional(v.id("products")),
    name: v.string(),
    price: v.float64(),
    sku: v.optional(v.string()),
    createdAt: v.float64(),
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
    price: v.optional(v.float64()),
    compareAtPrice: v.optional(v.float64()),
    subscriptionInterval: v.optional(v.string()),
    trialPeriodDays: v.optional(v.float64()),
    featuredImage: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    features: v.optional(v.any()),
    requirements: v.optional(v.any()),
    targetAudience: v.optional(v.string()),
    profitMargin: v.optional(v.float64()),
    status: productStatus,
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    createdAt: v.float64(),
    updatedAt: v.float64(),
    lastLogin: v.optional(v.float64()),
    lifetimeValue: v.optional(v.float64()),
    totalPurchases: v.optional(v.float64()),
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
    progressPercentage: v.optional(v.float64()),
    lastAccessed: v.float64(),
    timeSpent: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"]),

  subscriptions: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    productId: v.optional(v.id("products")),
    status: subscriptionStatus,
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.float64()),
    currentPeriodEnd: v.optional(v.float64()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
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
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  template_tools: defineTable({
    legacyId: v.optional(v.string()),
    templateId: v.id("platform_content_templates"),
    toolId: v.id("tools"),
    toolPurpose: v.optional(v.string()),
    createdAt: v.float64(),
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
    downloadCount: v.optional(v.float64()),
    rating: v.optional(v.float64()),
    ratingCount: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  }),

  ticket_replies: defineTable({
    legacyId: v.optional(v.string()),
    ticketId: v.optional(v.id("support_tickets")),
    authorId: v.optional(v.id("profiles")),
    content: v.string(),
    internalNote: v.optional(v.boolean()),
    createdAt: v.float64(),
  })
    .index("by_ticket", ["ticketId"]),

  tool_categories: defineTable({
    legacyId: v.optional(v.string()),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.float64(),
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
    rating: v.optional(v.float64()),
    ratingCount: v.optional(v.float64()),
    tutorialUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_name", ["name"])
    .index("by_category", ["categoryId"]),

  user_affiliate_clicks: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    affiliateLinkId: v.optional(v.id("affiliate_links")),
    clickedAt: v.float64(),
    converted: v.optional(v.boolean()),
    conversionValue: v.optional(v.float64()),
  })
    .index("by_user", ["userId"])
    .index("by_affiliate_link", ["affiliateLinkId"]),

  user_events: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    eventType: v.string(),
    eventData: v.optional(v.any()),
    sessionId: v.optional(v.string()),
    createdAt: v.float64(),
  }).index("by_user", ["userId"]),

  user_learning_progress: defineTable({
    legacyId: v.optional(v.string()),
    userId: v.optional(v.id("profiles")),
    courseId: v.optional(v.id("courses")),
    lessonId: v.optional(v.id("course_lessons")),
    learningPathId: v.optional(v.id("learning_paths")),
    moduleId: v.optional(v.id("learning_modules")),
    completed: v.optional(v.boolean()),
    progressPercentage: v.optional(v.float64()),
    lastAccessed: v.float64(),
    timeSpent: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_learning_path", ["learningPathId"]),

  webinar_registrations: defineTable({
    legacyId: v.optional(v.string()),
    webinarId: v.optional(v.id("webinars")),
    userId: v.optional(v.id("profiles")),
    status: webinarRegistrationStatus,
    registeredAt: v.float64(),
    attendedAt: v.optional(v.float64()),
  })
    .index("by_webinar", ["webinarId"])
    .index("by_user", ["userId"]),

  webinars: defineTable({
    legacyId: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    hostId: v.optional(v.id("profiles")),
    scheduledAt: v.float64(),
    duration: v.optional(v.float64()),
    maxAttendees: v.optional(v.float64()),
    platform: v.optional(v.string()),
    joinUrl: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    status: webinarStatus,
    createdAt: v.float64(),
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
    publishedAt: v.float64(),
    niche: v.optional(v.string()),
    agencyCategory: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index("by_externalId", ["externalId"])
    .index("by_publishedAt", ["publishedAt"]),
});
