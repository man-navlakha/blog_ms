export function calculateSeoScore({
  title,
  metaTitle,
  metaDescription,
  content,
  keywords,
  bannerUrl,
}) {
  const normalizedTitle = String(title || "").trim();
  const normalizedMetaTitle = String(metaTitle || "").trim();
  const normalizedDescription = String(metaDescription || "").trim();
  const normalizedContent = String(content || "").trim();
  const keywordList = Array.isArray(keywords)
    ? keywords.filter(Boolean)
    : String(keywords || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  let score = 0;
  const tips = [];

  if (normalizedTitle.length >= 35 && normalizedTitle.length <= 70) {
    score += 15;
  } else {
    tips.push("Keep title between 35 and 70 characters.");
  }

  if (normalizedMetaTitle.length >= 40 && normalizedMetaTitle.length <= 60) {
    score += 15;
  } else {
    tips.push("Keep meta title around 40-60 characters.");
  }

  if (
    normalizedDescription.length >= 120 &&
    normalizedDescription.length <= 160
  ) {
    score += 15;
  } else {
    tips.push("Keep meta description around 120-160 characters.");
  }

  if (normalizedContent.split(/\s+/).length >= 700) {
    score += 20;
  } else {
    tips.push("Content is short. Target at least 700 words.");
  }

  if (keywordList.length >= 3) {
    score += 15;
  } else {
    tips.push("Add at least 3 focus keywords.");
  }

  if (bannerUrl) {
    score += 10;
  } else {
    tips.push("Add a banner image for better CTR and social previews.");
  }

  if (keywordList.length > 0) {
    const sampleKeyword = keywordList[0].toLowerCase();
    const inTitle = normalizedTitle.toLowerCase().includes(sampleKeyword);
    const inDescription = normalizedDescription
      .toLowerCase()
      .includes(sampleKeyword);
    if (inTitle || inDescription) {
      score += 10;
    } else {
      tips.push("Use your main keyword in title or meta description.");
    }
  }

  return {
    score: Math.min(100, score),
    tips,
  };
}
