"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Printer } from "lucide-react";

// You can fetch this from a global config or context in a real app
const SCHOOL_NAME = "Greenwood International School";

export function ExamPaperGenerator() {
  // State for form inputs
  const [standard, setStandard] = useState("");
  const [topic, setTopic] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("2 Hours");

  // State for API response and loading
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePaper = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!standard || !topic || !totalMarks) {
      toast.error("Please fill in Standard, Topic, and Total Marks.");
      return;
    }
    setIsGenerating(true);
    setGeneratedPaper(null);

    // This payload sends the raw data to your backend.
    // Your backend will use this data to create the prompt for the AI.
    const payload = { standard, topic, totalMarks, duration, description };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/create_paper`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data && response.data.paper) {
        // --- FORMAT THE EXAM PAPER HEADER ---
        const header = `
# ${SCHOOL_NAME}
## Periodic Test - ${new Date().getFullYear()}

| Standard | Subject | Total Marks | Duration |
| :--- | :--- | :--- | :--- |
| **${standard}** | **${topic}** | **${totalMarks}** | **${duration}** |

---
`;
        // Prepend the header to the AI's formatted response
        const fullPaper = header + response.data.paper;
        setGeneratedPaper(fullPaper);
        toast.success("Exam paper generated successfully!");
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (error) {
      console.error("Error generating paper:", error);
      toast.error("Failed to generate exam paper.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* CSS for printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-paper,
          .printable-paper * {
            visibility: visible;
          }
          .printable-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            font-size: 12pt;
          }
          .no-print {
            display: none;
          }
          .printable-paper .prose h1,
          .printable-paper .prose h2 {
            text-align: center;
            margin-bottom: 0.5em;
          }
          .printable-paper .prose table {
            width: 100%;
            border: 1px solid black;
          }
          .printable-paper .prose th,
          .printable-paper .prose td {
            border: 1px solid black;
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 no-print">
          <Card>
            <CardHeader>
              <CardTitle>Paper Details</CardTitle>
              <CardDescription>
                Enter the parameters for the exam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneratePaper} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="standard">Standard</Label>
                  <Input
                    id="standard"
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    placeholder="e.g., 8th, 10th"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Subject</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., GEOGRAPHY & ECONOMICS"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalMarks">Total Marks</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value)}
                      placeholder="e.g., 40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description (For Question Generation)
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Include questions on Indian rivers and the banking sector."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isGenerating}
                >
                  {isGenerating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Paper"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-2">
          <Card className="min-h-[70vh]">
            <CardHeader className="flex flex-row items-center justify-between no-print">
              <div>
                <CardTitle>Generated Exam Paper</CardTitle>
                <CardDescription>
                  Review the generated paper below.
                </CardDescription>
              </div>
              {generatedPaper && (
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print Paper
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="flex justify-center items-center h-full pt-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {generatedPaper ? (
                <div className="printable-paper prose dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {generatedPaper.replace(/\\n/g, "  \n")}
                  </ReactMarkdown>
                </div>
              ) : (
                !isGenerating && (
                  <p className="text-center text-muted-foreground pt-20">
                    The generated exam paper will appear here.
                  </p>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
