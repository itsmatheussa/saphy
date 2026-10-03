import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const lookupSchema = z.object({ username: z.string().trim().min(3).max(20) });

export const lookupRobloxUser = createServerFn({ method: "POST" })
  .inputValidator((value) => lookupSchema.parse(value))
  .handler(async ({ data }) => {
    const userResponse = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [data.username], excludeBannedUsers: true }),
    });

    if (!userResponse.ok) throw new Error("Não foi possível consultar esse usuário agora.");
    const userPayload = (await userResponse.json()) as {
      data?: Array<{ id: number; name: string; displayName: string }>;
    };
    const user = userPayload.data?.[0];
    if (!user) return null;

    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`,
    );
    const avatarPayload = avatarResponse.ok
      ? ((await avatarResponse.json()) as { data?: Array<{ imageUrl?: string }> })
      : null;

    return {
      id: user.id,
      username: user.name,
      displayName: user.displayName,
      avatarUrl: avatarPayload?.data?.[0]?.imageUrl ?? "",
    };
  });