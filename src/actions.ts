"use server";

import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import webpush from "web-push";

function ensureVapidKeys() {
  if (
    !process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !process.env.VAPID_PRIVATE_KEY ||
    !process.env.VAPID_MAILTO
  ) {
    throw new Error("VAPID keys not set");
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_MAILTO}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function saveSubscription(subscription: PushSubscription) {
  const subId = crypto.randomUUID();

  await kv.hset("subscriptions", { [subId]: subscription });

  (await cookies()).set("subId", subId);
}

export async function sendNotification(subId: string) {
  ensureVapidKeys();
  
  const subscription = await kv.hget("subscriptions", subId);
  if (!subscription) return;

  const { statusCode, body, headers } = await webpush.sendNotification(
    subscription as webpush.PushSubscription,
    JSON.stringify({
      title: "Hello, from Monogram!",
      body: "👋 Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    })
  );

  console.log({ statusCode, headers, body });
}
