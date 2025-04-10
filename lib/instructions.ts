export const instructions = {
  get_campaign:
    '**Instructions for Response Formats:**\n\n1. **Count Queries:**\n\n - Only provide the number when specifically asked for a numeric count of fans, playlists, or related metrics. Use the following metrics for numeric count requests: Values suffixed with _count. Do NOT use this format for requests that ask for lists, detailed information.\n\n2. **Content Queries:**\n\n   - When asked about artists, albums, tracks, episodes (podcasts), playlists, audiobooks, shows, or genres, provide relevant information or lists based on the question. For questions about common podcast genres, do not reference the genres context; instead, use recommended genres generated from the episode descriptions. For example: "What are the most common podcast genres among fans?"\n\n3. **Country Distribution or Country Breakdown of Premium vs Free Fans:**\n\n   - Format as: "•  [country name]: •  Premium: [premium fans count]  •  Free: [free fan count]."\n\n5. **Listening Habits:**\n\n   - Overview: Summarize listening trends, including genres, artists, content types, countries, cities, and segments.\n\n   - Content Breakdown: Highlight popular items and standout artists.\n\n   - Engagement Metrics: Report key statistics and identify top performers.\n\n**Additional Note:**\n\n- Due to Apple\'s policy, we do not collect Apple Music emails. If asked specifically about collecting Apple Music emails, respond with: "Due to Apple\'s policy, we do not collect Apple Music emails." Follow this guidance strictly in inquiries regarding email collection.',
  additional_instruction:
    "1. Recommendations (2-3 Sentences): Provide actionable strategies to improve engagement.\n\n2. Trends and Insights (2-3 Sentences): Identify emerging trends or insights from the data and compare to broader industry trends if relevant.",
  get_campaign_score:
    'The guidelines below outline responses based on question type:\n\n"\n- Fan & Score Queries: Provide answer with fan name & score points.',
  get_tiktok_video_comments:
    "**Count Queries:** - Only provide the number when specifically asked for a numeric count of comments",
  get_tiktok_analysis:
    "Analyze the provided TikTok comment data to identify distinct fan segments. Leverage advanced natural language processing to generate insightful and sophisticated segment names that go beyond literal interpretations of the comments and capture the underlying motivations, sentiments, and engagement patterns of the user groups. The segment names should be concise yet evocative, employing professional and descriptive language. Present the results as a list of segment names and their corresponding user counts, formatted as: Segment Name: Count. Precede this with a brief artist profile: name, location, fan count, and follower count. Prioritize generating unique and insightful segment names, even if some segments have a small number of users.",
  get_segements_report: `
      - The report should include the following sections:
        1. Fan Report **[Segment Name]**
          **Crucially, 1 section MUST be formatted as follows:**
          [Simple AI-generated words (less than 15 characters) representing the segment's potential.] 🎭 **<br/>**
          Segment Name: [Segment Name] **<br/>**
          Segment Size: [Segment Size] fans ([Segment Percentage]% of total audience) **<br/>**

          **Example:**
            1. Fan Report Musical Theater Enthusiasts**
              Growing fanbase 🎭 **<br/>**
              Segment Name: Musical Theater Enthusiasts **<br/>**
              Segment Size: 15,000 fans (25% of total audience) **<br/>**

        2. Demographics
          Detail the key demographic characteristics of the segment, including age, gender, location (cities and countries), and any other relevant demographic information.
        3. Behavior Trends
          Describe the online and offline behaviors of the segment, including peak activity times, preferred platforms, relevant hashtags, and any other significant behavioral patterns.
        4. Engagement with [Brand/Artist Name]'s Content
          Analyze how the segment interacts with the brand/artist's content, highlighting key engagement metrics and preferred content types.(2 sentences )
        5. Potential Brand Partnerships
          This section MUST includes a subsection titled **Target Categorie**.
          **Crucially, this section MUST be formatted as follows:**
              
          **Example:**
              5. Potential Brand Partnerships
                Target Categories:
                  •	Anime Merchandise Retailers (e.g., Good Smile Company, Hot Topic, Redbubble).
                  •	Online Learning Platforms (e.g., Udemy, Skillshare for anime drawing classes).
                  •	Japanese Snacks & Beverages (e.g., Calbee, Ramune, Matcha KitKat).
        6. Brand Matchmaking
          Suggest specific brands with a match score (percentage) and justification for the match.
          Recommended brands are local, small or mid cap companies which are more accessible for artist outreach and partnership. For example: Buckeye Donuts, Skyline Chili, Coto Grocery in Buenos Aires 
        7. ROI Potential
          - Target Categories: the potential return on investment (ROI) for brand partnerships, including specific examples and metrics (e.g., estimated sales, brand awareness increase).
        8. Content Collaboration Ideas
          Propose at least three concrete content collaboration ideas that leverage the segment's interests and brand partnerships.
        9. Closing
          Summarize the key findings and recommendations. Include a call to action.
      `,
  sort_fans_on_segments:
    "You must analyze the comment data and categorize each user into one of the specified segment names provided in the [SEGMENTS NAMES]. Under no circumstances should you create or interpret segment names freely. You must strictly use the segment names given. The output must contain at least 100 unique usernames, avoiding repetition in segment assignment whenever possible. The results should be displayed in the following format: { [UserName]: [SegmentName] }.",
  get_fan_segments:
    "Analyze the provided comments data to identify distinct fan segments based on the topics discussed in the comments. The goal is to generate segment names similar in style to the example provided in the referenceSegments list: referenceSegments = [Musical Theater, Fashion Enthusiasts, Sports Betting, Parents with Toddlers, Aspiring Musicians, True Crime Lovers, Software Developers, DIY Creators, Anime Lovers, Social Influencers]. Generate insightful and sophisticated segment names that accurately reflect the subject matter of the comments, rather than user behavior. The segment names should be concise yet evocative, employing professional and descriptive language. Present the results as a list of segment names and their corresponding user counts, formatted as: Segment Name: Count. Prioritize generating unique and insightful segment names, even if some segments have a small number of users",
  get_segments_report_summary: `
    Generate a concise segment summary using this template. Provide brief, factual descriptions. 
    Use the example following as a guide for formatting and length.
      [Segment_Name] Fans
      **Size:** [Segment Size](Segment Size/Fan Size * 100%)
      **Demo:** Describe the key demographic characteristics of the segment, including age, gender.
      **Trends:**  Describe the online and offline behaviors of the segment, including peak activity times, preferred platforms.
      **Top Brands:** Suggest specific brands. Recommended brands are local, small or mid cap companies which are more accessible for artist outreach and partnership.
      
      Example:
        Sports Betting Fans
        Size: 12,000 (23%)
        Demo: 25-34, 75% male
        Trends: Active during events, +40% weekend
        Top Brands: Buckeye Donuts, Skyline Chili, Coto Grocery in Buenos Aires
    `,
  get_segments_icons:
    "Generates an icon name corresponding to each segment of the given **Segment names** in the **Icon Names**. IMPORTANT!!!: The generated name must exist in the **Icon Names**.",
  get_segments_report_next_step:
    "The response should include the following sections:\n\n**1.Explore Partnership Opportunities:** Briefly describe the strategy for identifying and selecting potential partners to collaborate with, focusing on alignment with the target audience or goals.\n\n \n\n**2.Refine Content Ideas:** Summarize the approach to improving content creation, emphasizing data-driven decisions and optimization for specific platforms and audiences. \n\n**3.Behavior Trends:** Describe how audience behavior will be monitored and analyzed to identify patterns, predict future trends, and inform future strategies.\n\n Each section should be only one sentence.",
  get_pitch_report: `
      - The report should include the following sections:
        1. Pitch Report **[Pitch Name]**
          **Crucially, 1 section MUST be formatted as follows:**
          [Simple AI-generated words (less than 15 characters) representing the pitch's potential.] 🎭 
          Pitch Name: [Pitch Name]
          Pitch Size: [Number] fans ([Percentage]% of total audience) 
          
          **Example:**
            1. Pitch Report Logic Pro**
              Growing fanbase 🎭 
              Pictch Name: Logic Pro 
              Pitch Size: 15,000 fans (25% of total audience) 
        
        2. Demographics
          Detail the key demographic characteristics of the pitch, including age, gender, location (cities and countries), and any other relevant demographic information.
        3. Behavior Trends
          Describe the online and offline behaviors of the pitch, including peak activity times, preferred platforms, relevant hashtags, and any other significant behavioral patterns.
        4. Engagement with [Brand/Artist Name]'s Content
          Analyze how the pitch interacts with the brand/artist's content, highlighting key engagement metrics and preferred content types.(2 sentences )
        5. Potential Brand Partnerships
          This section MUST includes a subsection titled **Target Categorie**.
          **Crucially, this section MUST be formatted as follows:**

            **Example:**
              5. Potential Brand Partnerships
                Target Categories:
                  • Anime Merchandise Retailers (e.g., Good Smile Company, Hot Topic, Redbubble).
                  • Online Learning Platforms (e.g., Udemy, Skillshare for anime drawing classes).
                  • Japanese Snacks & Beverages (e.g., Calbee, Ramune, Matcha KitKat).
        6. Brand Matchmaking
          Suggest specific brands with a match score (percentage) and justification for the match.
          Recommended brands are local, small or mid cap companies which are more accessible for artist outreach and partnership. For example: Buckeye Donuts, Skyline Chili, Coto Grocery in Buenos Aires
        7. ROI Potential
          - Target Categories: the potential return on investment (ROI) for brand partnerships, including specific examples and metrics (e.g., estimated sales, brand awareness increase).
        8. Content Collaboration Ideas
          Propose at least three concrete content collaboration ideas that leverage the segment's interests and brand partnerships.
        9. Closing
          Summarize the key findings and recommendations. Include a call to action.`,
  generate_segments: `You are an expert in identifying ultra-niche fan communities from social media comments. Your task is to generate segment names that are:

1. ULTRA-SPECIFIC - Identify very specific communities (e.g., "Chess Streamers" not "Game Players")
2. ACTIONABLE - Each segment should suggest a clear opportunity for musicians
3. SURPRISING - Reveal insights musicians wouldn't discover through conventional research

Analyze the provided comments and social data (username, bio, follower count, following count) to identify ultra-niche communities. Look for specific interests, behaviors, and patterns that reveal unique fan segments.

For each segment, think about an opportunity sentence with this structure:
[Specific Action] + [Specific Partner] + [Quantified Audience]

Example: "Feature your tracks in GM Hikaru's chess tournaments to reach 500K+ chess players."

GOOD SEGMENT EXAMPLES:
- Chess Streamers: Feature your tracks in GM Hikaru's chess tournaments to reach 500K+ chess players.
- Night Shift Medical Staff: Create "Night Shift" playlists with hospital networks reaching 600K healthcare workers.
- Pro Esports Fans: Provide walkout music for Team Liquid tournaments reaching 1.2M esports fans.

BAD SEGMENT EXAMPLES:
- Music Lovers: License tracks for a popular music platform. (Too obvious, not specific)
- Gamers: Promote music in a gaming event. (Too broad, not actionable)
- App Users: Create a playlist for a well-known app. (Not specific enough)

Your segments must be:
1. Surprising & valuable ("I wouldn't have thought of that!")
2. Focused on overlooked communities and unexpected partnerships
3. Quantifiable with specific audience sizes and characteristics
4. Immediately actionable for targeted streaming growth

When analyzing comments, look for:
1. Specific references to niche activities, communities, or interests
2. Unique behavioral patterns or lifestyle indicators
3. Specialized terminology or jargon that indicates membership in a community
4. References to specific events, platforms, or influencers
5. Timing patterns (when they engage) that might indicate specific lifestyles

When social data is available, use it to enhance your understanding:
- User bios that reveal specific interests, occupations, or identities
- Follower/following ratios that might indicate influencer status or community roles
- Username patterns that could suggest demographic or interest information

The segment names should be ultra-specific (2-4 words) yet evocative, employing professional and descriptive language that directly connects to the comment content and social context.

Response format must be a JSON array of strings containing ONLY the segment names.
Example based on actual comments:
["Chess Streamers", "Night Shift Medical Staff", "Pro Esports Fans", "Plant-Based Recipe Creators", "Indie Game Developers"]

Important:
- Each segment name must be derived from actual comment content or social data
- Avoid generic segments like "Superfans" or "Music Lovers" - be ultra-specific
- Focus on identifying surprising, overlooked communities
- Create segments that suggest immediate, actionable opportunities for musicians
- When social data is available, use it to create more nuanced and accurate segments`,
  group_segments: `Analyze each comment and assign it to the most appropriate segment from the provided list. 

    IMPORTANT: Your response must be a valid JSON array of objects with EXACTLY this structure:
    {
      "segment_name": string (must be one of the provided segment names),
      "fan_social_ids": string[] (array of fan_social_ids, MUST use the exact fan_social_id from the input comments, DO NOT use comment text)
    }

    CRITICAL REQUIREMENTS:
    1. ONLY use the exact fan_social_id values from the input comments
    2. DO NOT use comment text as fan_social_ids
    3. Each fan_social_id must be a valid UUID string
    4. DO NOT modify or transform the fan_social_ids in any way

    Example input:
    {
      "comment": "Great song!",
      "fan_social_id": "123e4567-e89b-12d3-a456-426614174000"
    }

    Example response:
    [
      {
        "segment_name": "Superfans",
        "fan_social_ids": ["123e4567-e89b-12d3-a456-426614174000"]
      }
    ]

    Do not include any explanations or markdown formatting. Return ONLY the JSON array.`,
};
