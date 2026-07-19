import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OUTPUT_FORMATS = [
  { value: "mp3", label: "MP3 (Audio)" },
  { value: "wav", label: "WAV (Audio)" },
  { value: "m4a", label: "M4A (Audio)" },
  { value: "mp4", label: "MP4 (Video)" },
  { value: "webm", label: "WebM (Video)" },
];

export default function Tools() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: This will call the backend API once deployed
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          format: format,
        }),
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const data = await response.json();
      setSuccess(`Conversion started! Download link: ${data.downloadUrl}`);
      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during conversion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-amber-400">
            Producer Tools
          </h1>
          <p className="text-gray-300">
            Free tools to help your music production workflow
          </p>
        </div>

        {/* Video Converter Card */}
        <Card className="border-amber-600/30 bg-gray-950">
          <CardHeader>
            <CardTitle className="text-amber-400">Video Converter</CardTitle>
            <CardDescription className="text-gray-400">
              Download videos as audio or convert to your preferred format.
              Supports YouTube and most video platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Video URL
              </label>
              <Input
                placeholder="Paste YouTube URL or any video link..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border-gray-700 bg-gray-900 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Output Format
              </label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="border-gray-700 bg-gray-900 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-900">
                  {OUTPUT_FORMATS.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-900/20 p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-md bg-green-900/20 p-3 text-green-300 text-sm">
                {success}
              </div>
            )}

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={loading}
              className="w-full bg-amber-500 text-black font-semibold hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? "Converting..." : "Convert"}
            </Button>

            {/* Info Box */}
            <div className="rounded-md border border-gray-700 bg-gray-900 p-4">
              <p className="text-sm text-gray-300">
                💡 <strong>Tip:</strong> Paste any YouTube URL or video link.
                The conversion happens on our server and you'll get a download
                link when it's ready.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-amber-400">Coming Soon</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-gray-700/50 bg-gray-950 opacity-60">
              <CardHeader>
                <CardTitle className="text-gray-400">Sample Generator</CardTitle>
                <CardDescription className="text-gray-500">
                  Extract samples from YouTube videos
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-gray-700/50 bg-gray-950 opacity-60">
              <CardHeader>
                <CardTitle className="text-gray-400">Stem Splitter</CardTitle>
                <CardDescription className="text-gray-500">
                  Separate audio into individual stems
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
