const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function readConnectionString() {
  const envPath = path.join(process.cwd(), ".env");
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) continue;
    const firstEq = line.indexOf("=");
    if (firstEq < 0) continue;

    const key = line.slice(0, firstEq).trim();
    const rawValue = line.slice(firstEq + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key === "DATABASE_URL" || key === "Database_url") {
      return value;
    }
  }

  return "";
}

const posts = [
  {
    title: "What is Mechanic Setu? Complete Guide to Our Services",
    slug: "what-is-mechanic-setu",
    metaTitle: "What is Mechanic Setu | Roadside Assistance Platform",
    metaDescription:
      "Learn what Mechanic Setu is, how it works, and how our roadside assistance and vehicle support services help drivers stay safe.",
    keywords: ["mechanic setu", "roadside assistance", "vehicle support", "car help"],
    content:
      "Mechanic Setu is a driver-first platform built to connect vehicle owners with reliable roadside help and trusted service professionals. From battery jumpstarts to emergency towing, our network is designed to reduce breakdown stress and get you moving faster.\n\nOur mission is simple: make vehicle care more accessible, transparent, and responsive. Mechanic Setu helps with urgent needs as well as preventive guidance through practical content and service recommendations.\n\nWe focus on three core outcomes for drivers: fast emergency response, verified support professionals, and clear communication during every service request.\n\nWhether you are commuting daily or driving long routes, Mechanic Setu is designed to be your dependable roadside companion.",
  },
  {
    title: "24x7 Roadside Assistance: How Mechanic Setu Helps During Breakdowns",
    slug: "24x7-roadside-assistance-mechanic-setu",
    metaTitle: "24x7 Roadside Assistance by Mechanic Setu",
    metaDescription:
      "Understand how Mechanic Setu roadside assistance works for punctures, battery issues, towing, and emergency on-road support.",
    keywords: ["24x7 roadside assistance", "car breakdown help", "emergency towing", "flat tyre support"],
    content:
      "Breakdowns can happen without warning. Mechanic Setu offers 24x7 roadside support so drivers can request help quickly and safely.\n\nCommon emergency cases include flat tyres, dead batteries, overheating, fuel delivery needs, and towing support. Our workflow prioritizes location accuracy and response speed to reduce waiting time.\n\nOnce a request is raised, the nearest available support partner is assigned. Status updates keep drivers informed so they can plan safely while waiting for help.\n\nWith Mechanic Setu, roadside assistance becomes predictable, trackable, and far less stressful for everyday users.",
  },
  {
    title: "Battery Jumpstart and Electrical Help: Service Overview",
    slug: "battery-jumpstart-electrical-help",
    metaTitle: "Battery Jumpstart Service | Mechanic Setu",
    metaDescription:
      "Explore Mechanic Setu battery jumpstart and basic electrical troubleshooting services for cars and two-wheelers.",
    keywords: ["battery jumpstart", "car battery dead", "electrical troubleshooting", "mechanic setu services"],
    content:
      "A dead battery is one of the most common roadside issues. Mechanic Setu provides quick jumpstart support and basic electrical checks to get vehicles running again.\n\nOur service partners inspect battery terminals, cable connections, and visible electrical symptoms before recommending next steps. If replacement is needed, drivers get clear guidance instead of guesswork.\n\nFor repeated battery failure, early diagnosis is important. Alternator and charging issues can be identified through basic tests and referred for deeper workshop inspection.\n\nMechanic Setu helps drivers restore mobility quickly while reducing the risk of repeated no-start incidents.",
  },
  {
    title: "Tyre Puncture and Wheel Support: Fast On-Road Solutions",
    slug: "tyre-puncture-wheel-support",
    metaTitle: "Tyre Puncture Support | Mechanic Setu",
    metaDescription:
      "Learn how Mechanic Setu tyre puncture and wheel support services provide quick roadside recovery and safer driving continuity.",
    keywords: ["tyre puncture", "flat tyre", "wheel service", "roadside tyre repair"],
    content:
      "Tyre punctures can delay travel and create safety concerns, especially at night or on highways. Mechanic Setu connects drivers with fast puncture and wheel support services.\n\nSupport includes puncture repair, temporary inflation guidance, and spare wheel replacement where applicable. Drivers also receive practical advice on pressure checks and tyre condition.\n\nIgnoring tyre wear leads to repeat incidents. We encourage regular tread checks and alignment reviews to reduce roadside failures.\n\nWith Mechanic Setu, a flat tyre becomes a manageable interruption instead of a major disruption.",
  },
  {
    title: "Emergency Towing Service: When and Why You Need It",
    slug: "emergency-towing-service-guide",
    metaTitle: "Emergency Towing Guide | Mechanic Setu",
    metaDescription:
      "Know when to request emergency towing through Mechanic Setu and how towing support ensures safer vehicle recovery.",
    keywords: ["emergency towing", "tow truck", "vehicle recovery", "roadside emergency"],
    content:
      "Some breakdowns cannot be fixed on the spot. In such cases, towing is the safest and fastest path to recovery. Mechanic Setu assists with emergency towing coordination for critical failures.\n\nTypical towing scenarios include engine seizure, severe overheating, accident recovery, transmission lock, and electrical failure that prevents startup.\n\nOur team helps route the vehicle to an appropriate workshop while keeping the driver updated during pickup and transit.\n\nTimely towing reduces secondary damage and improves safety, especially on high-speed roads and traffic-heavy routes.",
  },
  {
    title: "Preventive Vehicle Care Checklist for Everyday Drivers",
    slug: "preventive-vehicle-care-checklist",
    metaTitle: "Preventive Vehicle Care Checklist | Mechanic Setu",
    metaDescription:
      "Use this practical Mechanic Setu preventive maintenance checklist to reduce breakdowns and improve vehicle reliability.",
    keywords: ["vehicle maintenance", "preventive care", "car checklist", "avoid breakdown"],
    content:
      "Preventive maintenance is the best way to avoid emergency breakdowns. Mechanic Setu recommends a simple checklist that drivers can follow monthly.\n\nCheck battery health, tyre pressure, fluid levels, brake response, and warning lights. Small issues caught early can prevent expensive repairs later.\n\nBefore long trips, inspect tyre condition, coolant level, and tool kit readiness. Keep emergency contacts and service support accessible.\n\nConsistent preventive care improves reliability, lowers repair costs, and makes everyday driving safer and more confident.",
  },
];

async function main() {
  const connectionString = readConnectionString();
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL or Database_url in .env");
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const post of posts) {
      await client.query(
        `
          insert into blogs (
            title,
            slug,
            content,
            meta_title,
            meta_description,
            keywords,
            status,
            published_at,
            updated_at
          )
          values ($1, $2, $3, $4, $5, $6::text[], 'published', now(), now())
          on conflict (slug)
          do update set
            title = excluded.title,
            content = excluded.content,
            meta_title = excluded.meta_title,
            meta_description = excluded.meta_description,
            keywords = excluded.keywords,
            status = 'published',
            published_at = coalesce(blogs.published_at, now()),
            updated_at = now(),
            deleted_at = null
        `,
        [
          post.title,
          post.slug,
          post.content,
          post.metaTitle,
          post.metaDescription,
          post.keywords,
        ]
      );
    }

    const countResult = await client.query(
      "select count(*)::int as count from blogs where slug = any($1::text[])",
      [posts.map((post) => post.slug)]
    );

    console.log(`Seed complete. Default service blogs available: ${countResult.rows[0]?.count || 0}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
