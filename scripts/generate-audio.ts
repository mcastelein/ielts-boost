/**
 * Generate and cache TTS audio for all listening tracks that are missing audio
 * or whose transcript has been updated since the audio was last generated.
 *
 * Run with:
 *   npx tsx scripts/generate-audio.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 *
 * Audio files are stored in Supabase Storage bucket: listening-audio
 * Create this bucket in the Supabase dashboard before running (set to Public).
 */

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

function getClients() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const openai = new OpenAI({ apiKey: openaiKey });

  return { supabase, openai };
}

async function main() {
  const { supabase, openai } = getClients();

  // Fetch all tracks and filter client-side — PostgREST can't do column-to-column comparisons.
  const { data: allTracks, error } = await supabase
    .from("listening_tracks")
    .select("slug, title, transcript, audio_url, transcript_updated_at, audio_generated_at");

  if (error) {
    console.error("Failed to fetch tracks:", error.message);
    process.exit(1);
  }

  // Keep rows where audio is missing or stale (transcript changed after last generation).
  const tracks = allTracks?.filter(
    (t) =>
      !t.audio_generated_at ||
      new Date(t.audio_generated_at) < new Date(t.transcript_updated_at)
  );

  if (!tracks || tracks.length === 0) {
    console.log("✅ All tracks are up to date. Nothing to do.");
    return;
  }

  console.log(`Found ${tracks.length} track(s) needing audio generation.\n`);

  for (const track of tracks) {
    console.log(`Generating audio for: ${track.title} (${track.slug})`);

    try {
      // Generate TTS via OpenAI
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova",
        input: track.transcript,
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Supabase Storage, overwriting any existing file
      const storagePath = `${track.slug}.mp3`;
      const { error: uploadError } = await supabase.storage
        .from("listening-audio")
        .upload(storagePath, buffer, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(`  ❌ Upload failed: ${uploadError.message}`);
        continue;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("listening-audio")
        .getPublicUrl(storagePath);

      const audioUrl = urlData.publicUrl;

      // Write audio_url and audio_generated_at back to the track row
      const { error: updateError } = await supabase
        .from("listening_tracks")
        .update({
          audio_url: audioUrl,
          audio_generated_at: new Date().toISOString(),
        })
        .eq("slug", track.slug);

      if (updateError) {
        console.error(`  ❌ DB update failed: ${updateError.message}`);
        continue;
      }

      console.log(`  ✅ Done — ${audioUrl}`);
    } catch (err) {
      console.error(`  ❌ Error: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log("\nAudio generation complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
