import { ExamPaperGenerator } from "../pages/exma_paper_gunration_pages/Gunrate_exam";

export default function ExamPaperGeneratorPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
          Automatic Exam Paper Generator
        </h1>
        <p className="text-muted-foreground">
          Generate a complete exam paper by providing a few key details.
        </p>
      </div>
      <ExamPaperGenerator />
    </div>
  );
}
