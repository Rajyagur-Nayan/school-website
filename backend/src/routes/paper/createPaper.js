const express = require("express");
const getGeminiResponse = require("../../controllers/gemini.js"); // Adjust path if needed

const router = express.Router();

/**
 * @route   POST /api/generate-paper
 * @desc    Generate an exam paper using AI based on user inputs.
 * @access  Private (Faculty/Admin)
 * @body    { "standard": "Class 10", "topic": "Trigonometry", "totalMarks": 50, "description": "Include at least one question on trigonometric identities." }
 */
router.post("/", async (req, res) => {
  const {
    standard,
    topic,
    totalMarks,
    description,
    duration = "2 hours",
  } = req.body;
  const topic_in_uppercase = (topic || "").toUpperCase();

  // --- Validation ---
  if (!standard || !topic || !totalMarks) {
    return res
      .status(400)
      .json({ error: "standard, topic, and totalMarks are required." });
  }
  if (isNaN(parseInt(totalMarks)) || totalMarks <= 0) {
    return res
      .status(400)
      .json({ error: "Total marks must be a positive number." });
  }

  try {
    // --- Prompt Engineering: Create a high-quality prompt for the AI ---
    const prompt = `
            You are an expert academic paper formatter AI. Your task is to generate a complete exam paper in Markdown format based on the user's specifications.

**User Inputs:**
- Standard: {standard}
- Subject/Topic: {topic}
- Total Marks: {totalMarks}
- Duration: {duration}
- Description (for question generation): {description}

**Instructions:**
1. Strictly adhere to the Markdown format provided in the template below.
2. Replace placeholders like {standard},{topic}, {totalMarks}, and {duration} with the actual values from the "User Inputs". Ensure the main topic title is in ALL CAPS.
3. Based on the "Subject/Topic" and "Description", generate relevant and appropriate questions for each section.
4. Ensure the number of questions and marks for each sub-question match the template exactly.
5. Your final output must be a single Markdown string, ready to be rendered. Do not include any extra explanations or text outside of the template.

**Markdown Template:**
---
<div align="center">
  <strong>Format of question paper for Std. {standard}</strong>
</div>

<div style="display: flex; justify-content: space-between;">
  <span><strong>Time: {duration}</strong></span>
  <span><strong>Marks: {totalMarks}</strong></span>
</div>

<div align="center">
  <strong>{topic_in_uppercase}</strong>
</div>

---
**Q. No.** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Nature of questions** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Marks**
---

### **GEOGRAPHY**

**Note:**
1. All questions are compulsory.
2. Figures to the right indicate full marks.
3. Use the outline map of India for Q.3(C).
4. The use of stencil is allowed for drawing maps.
5. Use graph paper for Q.3(A).

---

**Q.1.**
**(A)** [Generate 3 "Choose the correct alternative" statements here based on the topic] **[3]**
**(B)** [Generate a "Match the columns" question with 3 pairs here based on the topic] **[3]**

**Q.2.**
**(A)** [Generate 3 "Give geographical reasons" statements here. Student answers any two.] **[4]**
**(B)** [Generate 3 topics for "Write short notes on". Student answers any two.] **[4]**

**Q.3.**
**(A)** [Describe a "Graph question with the help of given information" here.] **[2]**
**(B)** [Describe a "diagram observation" task with 4 sub-questions. Student answers any two.] **[2]**
**(C)** [Describe a "Map question" with 4 items to mark. Student marks any two.] **[2]**

**Q.4.** [Generate 3 detailed answer questions here. Student answers any two.] **[8]**

---

### **ECONOMICS**

**Q.5.** [Generate 2 "Fill in the blanks" questions with alternatives. Student answers any one.] **[2]**

**Q.6.** [Generate 5 "Answer in one or two sentences" questions. Student answers any three.] **[6]**

**Q.7.** [Generate 2 "Answer in five or six sentences" questions. Student answers any one.] **[4]**

<br>
<div align="center">
*******
</div>
---
        `;

    console.log("🤖 Sending prompt to Gemini AI...");
    const paperContent = await getGeminiResponse(prompt);
    console.log("✅ Received response from Gemini AI.");

    res.status(200).json({
      message: "Exam paper generated successfully.",
      paper: paperContent,
    });
  } catch (err) {
    console.error("Paper Generation Route Error:", err);
    res
      .status(500)
      .json({
        error:
          err.message ||
          "An internal error occurred while generating the paper.",
      });
  }
});

module.exports = router;
