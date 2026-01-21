import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PROSE = "prose prose-lg dark:prose-invert max-w-none overflow-visible prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-lg";

// Strip HTML tags from text (helper function)
function stripHTMLTags(text: string): string {
  if (typeof text !== 'string') return text;
  // Remove HTML tags but preserve content
  return text.replace(/<[^>]*>/g, '').trim();
}

// TipTap/ProseMirror JSON to Markdown converter
function convertTipTapToHTML(node: any): string {
  if (!node || typeof node !== 'object') return '';

  // Handle text nodes
  if (node.type === 'text') {
    let text = node.text || '';
    // Strip any HTML tags that might have been included
    text = stripHTMLTags(text);
    // Apply marks (bold, italic, etc.)
    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === 'bold') {
          text = `**${text}**`;
        } else if (mark.type === 'italic') {
          text = `*${text}*`;
        } else if (mark.type === 'code') {
          text = `\`${text}\``;
        } else if (mark.type === 'link') {
          text = `[${text}](${mark.attrs?.href || '#'})`;
        }
      });
    }
    return text;
  }

  // Handle different node types
  let html = '';
  const content = node.content || [];

  switch (node.type) {
    case 'doc':
      return content.map((child: any) => convertTipTapToHTML(child)).filter(Boolean).join('\n\n');
    
    case 'paragraph':
      const paraContent = content.map((child: any) => convertTipTapToHTML(child)).join('');
      // Return plain text for paragraphs (ReactMarkdown will wrap it in <p>)
      // Strip any HTML tags that might have leaked through
      return paraContent ? stripHTMLTags(paraContent) : '';
    
    case 'heading':
      const level = node.attrs?.level || 1;
      const headingContent = content.map((child: any) => convertTipTapToHTML(child)).join('');
      const hashes = '#'.repeat(level);
      return headingContent ? `${hashes} ${headingContent}\n\n` : '';
    
    case 'bulletList':
      return content.map((child: any) => convertTipTapToHTML(child)).join('\n');
    
    case 'orderedList':
      return content.map((child: any, index: number) => {
        const itemContent = convertTipTapToHTML(child);
        return itemContent ? `${index + 1}. ${itemContent.replace(/^- /, '')}` : '';
      }).join('\n');
    
    case 'listItem':
      const itemContent = content.map((child: any) => convertTipTapToHTML(child)).join('');
      return itemContent ? `- ${itemContent}` : '';
    
    case 'blockquote':
      const quoteContent = content.map((child: any) => convertTipTapToHTML(child)).join('');
      return quoteContent ? `> ${quoteContent.split('\n').join('\n> ')}\n\n` : '';
    
    case 'codeBlock':
      const codeContent = content.map((child: any) => child.text || '').join('\n');
      const language = node.attrs?.language || '';
      return `\`\`\`${language}\n${codeContent}\n\`\`\`\n\n`;
    
    case 'hardBreak':
      return '\n';
    
    case 'horizontalRule':
      return '---\n\n';
    
    case 'image':
      const src = node.attrs?.src || '';
      const alt = node.attrs?.alt || '';
      return src ? `![${alt}](${src})\n\n` : '';
    
    case 'text':
      return node.text || '';
    
    default:
      // For unknown types, try to extract text content
      if (content && Array.isArray(content)) {
        return content.map((child: any) => convertTipTapToHTML(child)).join('');
      }
      return '';
  }
}

// Type for content that might have children property
interface ContentWithChildren {
  children?: unknown;
  type?: string;
  content?: unknown;
  [key: string]: unknown;
}

// Check if content is TipTap/ProseMirror format
function isTipTapFormat(content: unknown): boolean {
  if (!content) return false;
  
  // Check for TipTap/ProseMirror structure in object
  if (typeof content === 'object' && content !== null) {
    const contentObj = content as ContentWithChildren;
    if (contentObj.type === 'doc' && Array.isArray(contentObj.content)) {
      return true;
    }
    // Check if it's wrapped in a React component-like structure
    if (contentObj.children && typeof contentObj.children === 'object') {
      return isTipTapFormat(contentObj.children);
    }
  }
  
  // Also check if it's a string that parses to TipTap format
  if (typeof content === 'string') {
    // Remove HTML/React component wrappers
    let cleanContent = content.trim();
    // Handle cases like <Markdown children="..."> or <p>...</p>
    if (cleanContent.startsWith('<') && cleanContent.includes('children=')) {
      const match = cleanContent.match(/children=["']({.*?})["']/);
      if (match && match[1]) {
        cleanContent = match[1].replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
      }
    }
    // Remove HTML tags
    cleanContent = cleanContent.replace(/<[^>]*>/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanContent);
      return parsed && parsed.type === 'doc' && Array.isArray(parsed.content);
    } catch {
      // Try to extract JSON from the string
      const jsonMatch = cleanContent.match(/\{.*"type"\s*:\s*"doc".*\}/s);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed && parsed.type === 'doc' && Array.isArray(parsed.content);
        } catch {
          return false;
        }
      }
      return false;
    }
  }
  
  return false;
}

const EMPTY_STATE = (
  <div className="text-center py-12">
    <p className="text-muted-foreground mb-4">Article content is not available yet.</p>
    <p className="text-sm text-muted-foreground">
      Please check back later or contact support if this issue persists.
    </p>
  </div>
);

type ToolItem = {
  name?: string;
  pros?: string[];
  cons?: string[];
  best_for?: string;
  [key: string]: unknown;
};

type SectionItem = {
  title?: string;
  heading?: string;
  content?: string;
  [key: string]: unknown;
};

export function ArticleContentRenderer({ content }: { content: unknown }) {
  if (content == null || content === "") {
    return EMPTY_STATE;
  }

  // First, try to parse if it's a string that might be JSON
  let parsedContent: unknown = content;
  if (typeof content === "string" && content.trim().startsWith("{")) {
    try {
      parsedContent = JSON.parse(content);
    } catch {
      // Not JSON, keep as string
      parsedContent = content;
    }
  }

  // Check if parsed content is TipTap/ProseMirror format
  if (isTipTapFormat(parsedContent)) {
    let tipTapContent = parsedContent;
    
    // Handle object format
    if (typeof parsedContent === "object" && parsedContent !== null) {
      const contentObj = parsedContent as ContentWithChildren;
      // If wrapped in children prop
      if (contentObj.children && typeof contentObj.children === 'object') {
        tipTapContent = contentObj.children;
      } else {
        tipTapContent = parsedContent;
      }
    }
    
    // Handle string format
    if (typeof parsedContent === "string") {
      let cleanContent = parsedContent.trim();
      // Extract JSON from HTML/React component wrappers
      if (cleanContent.includes('children=')) {
        const match = cleanContent.match(/children=["']({.*?})["']/);
        if (match && match[1]) {
          cleanContent = match[1].replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
        }
      }
      // Remove HTML tags
      cleanContent = cleanContent.replace(/<[^>]*>/g, '').trim();
      // Try to extract JSON
      const jsonMatch = cleanContent.match(/\{.*"type"\s*:\s*"doc".*\}/s);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      try {
        tipTapContent = JSON.parse(cleanContent);
      } catch {
        return EMPTY_STATE;
      }
    }
    
    const htmlContent = convertTipTapToHTML(tipTapContent);
    if (htmlContent) {
      return (
        <div className={PROSE}>
          <ReactMarkdown>{htmlContent}</ReactMarkdown>
        </div>
      );
    }
    return EMPTY_STATE;
  }

  // Now check if it's structured content (intro + sections format)
  let obj: Record<string, unknown> | null = null;

  if (typeof parsedContent === "object" && !Array.isArray(parsedContent) && parsedContent !== null) {
    obj = parsedContent as Record<string, unknown>;
  } else if (typeof content === "string") {
    // If original content is string and not parsed yet, try parsing
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        obj = parsed;
      }
    } catch {
      // Not JSON — treat as Markdown
      return (
        <div className={PROSE}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }
  }

  if (!obj) return EMPTY_STATE;

  const intro = obj.intro;
  const body = (obj.body ?? obj.content) as string | undefined;
  const tools = (Array.isArray(obj.tools) ? obj.tools : []) as ToolItem[];
  const sections = (Array.isArray(obj.sections) ? obj.sections : []) as SectionItem[];
  const conclusion = obj.conclusion as string | undefined;
  const toolsHeading =
    (typeof obj.tools_heading === "string" ? obj.tools_heading : null) ?? "Tools";

  // Check if we have structured content
  const hasIntro = (typeof intro === "string" && intro.length > 0) ||
    (typeof intro === "object" && intro !== null && isTipTapFormat(intro)) ||
    (Array.isArray(intro) && intro.length > 0);
  const hasBody = (typeof body === "string" && body.length > 0) ||
    (typeof body === "object" && body !== null && isTipTapFormat(body));
  const hasSections = sections.length > 0;
  const hasTools = tools.length > 0;
  const hasConclusion = (typeof conclusion === "string" && conclusion.length > 0) ||
    (typeof conclusion === "object" && conclusion !== null && isTipTapFormat(conclusion));

  const hasStructured = hasIntro || hasBody || hasTools || hasSections || hasConclusion;

  if (!hasStructured) {
    if (typeof content === "string") {
      return (
        <div className={PROSE}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      );
    }
    return (
      <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
        {JSON.stringify(obj, null, 2)}
      </pre>
    );
  }

  return (
    <>
      {/* Intro Section - Large, prominent opening */}
      {hasIntro && (
        <div className={`${PROSE} mb-12 pb-8 border-b`}>
          {typeof intro === "string" && intro.length > 0 && (
            <>
              {isTipTapFormat(intro) ? (
                <ReactMarkdown>{convertTipTapToHTML(typeof intro === "string" ? JSON.parse(intro) : intro)}</ReactMarkdown>
              ) : (
                <div className="text-xl leading-relaxed text-foreground/90 font-light">
                  <ReactMarkdown>{intro}</ReactMarkdown>
                </div>
              )}
            </>
          )}
          {typeof intro === "object" && intro !== null && !Array.isArray(intro) && isTipTapFormat(intro) && (
            <ReactMarkdown>{convertTipTapToHTML(intro)}</ReactMarkdown>
          )}
          {Array.isArray(intro) && intro.length > 0 && (
            <>
              {intro
                .filter((p): p is string => typeof p === "string")
                .map((p, i) => (
                  <div key={i} className={i === 0 ? "text-xl leading-relaxed text-foreground/90 font-light mb-4" : ""}>
                    {isTipTapFormat(p) ? (
                      <ReactMarkdown>{convertTipTapToHTML(JSON.parse(p))}</ReactMarkdown>
                    ) : (
                      <ReactMarkdown>{p}</ReactMarkdown>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      )}
      {typeof body === "string" && body.length > 0 && (
        <div className={`${PROSE} mb-8`}>
          {isTipTapFormat(body) ? (
            <ReactMarkdown>{convertTipTapToHTML(typeof body === "string" ? JSON.parse(body) : body)}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{body}</ReactMarkdown>
          )}
        </div>
      )}
      {typeof body === "object" && body !== null && isTipTapFormat(body) && (
        <div className={`${PROSE} mb-8`}>
          <ReactMarkdown>{convertTipTapToHTML(body)}</ReactMarkdown>
        </div>
      )}
      {tools.length > 0 && (
        <div className="mt-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">{toolsHeading}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t, i) => (
              <Card key={i} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t.name ?? "Unnamed"}</CardTitle>
                  {t.best_for && (
                    <Badge variant="secondary" className="mt-2 w-fit">
                      {String(t.best_for)}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {Array.isArray(t.pros) && t.pros.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Pros:</span>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {t.pros.map((p, j) => (
                          <li key={j}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(t.cons) && t.cons.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Cons:</span>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {t.cons.map((c, j) => (
                          <li key={j}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {hasSections &&
        sections.map((s, i) => {
          const heading = s.heading || s.title;
          let sectionContent = s.content;
          
          // Handle TipTap format in section content
          if (sectionContent && isTipTapFormat(sectionContent)) {
            let tipTapContent = sectionContent;
            if (typeof sectionContent === "string") {
              try {
                tipTapContent = JSON.parse(sectionContent);
              } catch {
                tipTapContent = null;
              }
            }
            if (tipTapContent) {
              sectionContent = convertTipTapToHTML(tipTapContent);
            }
          }
          
          // Ensure sectionContent is a string
          if (sectionContent && typeof sectionContent !== "string") {
            if (typeof sectionContent === "object") {
              sectionContent = JSON.stringify(sectionContent);
            } else {
              sectionContent = String(sectionContent);
            }
          }
          
          return (
            <section key={i} className="mb-12 scroll-mt-20">
              {heading && (
                <h2 className="text-3xl font-bold mb-6 mt-12 first:mt-0 text-foreground tracking-tight">
                  {String(heading)}
                </h2>
              )}
              {sectionContent && (
                <div className={PROSE}>
                  <ReactMarkdown>{sectionContent}</ReactMarkdown>
                </div>
              )}
            </section>
          );
        })}
      {typeof conclusion === "string" && conclusion.length > 0 && (
        <div className={`${PROSE} mt-8`}>
          {isTipTapFormat(conclusion) ? (
            <ReactMarkdown>{convertTipTapToHTML(typeof conclusion === "string" ? JSON.parse(conclusion) : conclusion)}</ReactMarkdown>
          ) : (
            <ReactMarkdown>{conclusion}</ReactMarkdown>
          )}
        </div>
      )}
      {typeof conclusion === "object" && conclusion !== null && isTipTapFormat(conclusion) && (
        <div className={`${PROSE} mt-8`}>
          <ReactMarkdown>{convertTipTapToHTML(conclusion)}</ReactMarkdown>
        </div>
      )}
    </>
  );
}

