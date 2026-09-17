export const buildPrompt = ({
    topic,
    classLevel,
    examType,
    revisionMode,
    includeDiagram,
    includeChart
}) =>{
    return `
    You are a STRICT JSON generator for an exam preparation system.
    ⚠️ VERY IMPORTANT:
    - Output MUST be valid JSON
    - Your response will be parsed using JSON.parse()
    - INVALID JSON will cause system failure
    - Use ONLY double quotes "
    - No comments, NO trailing commas
    - Escape line breaks using \\n
    - DON NOT use emojis inside text values

    TASK:
    Convert the given topic into exam-focused notes.

    INPUT:
    Topic: ${topic}
    Class Level: ${classLevel || "Not specified"}
    Exam Type:${examType || "General"}
    Revison Mode: ${revisionMode ? "ON" : "OFF"}
    Include Diagram : ${includeDiagram ? "YES" :"NO"}
    Include Charts : ${includeChart ?"YES":"NO" }

    GLOBAL CONTENT RULES:
    - Use clear, simple , exam-oriented language
    - Notes MUST be Markdown formatted
    - Headings and bullet points only
    
    REVISION MODES RULES(CRITICAL):
    - If REVISION MODE is ON:
     -Notes must be VERY SHORT
     - Only bullet points
     - One-line answers only
     - Definitons, formulas, keywords
     - No paragraphs
     - No explanations
     - Content must feel like:
      - last-day revision
      - 5-minutes exam cheet sheet
     - revisionPoints MUST summarize ALL important facts

    - If REVISION MODE is OFF:
     - Notes must be DETAILED but exam-focused
     - Each topic should include
      - definition
      - short explanation
      - examples (if applicable)
    - Paragraph length : max 2-4 lines
    - No storytelling, no extra theory
    
    IMPORTANT RULES:
    - Divide sub-topics into THREE categories:
     - ⭐ Very Important Topics
     - ⭐⭐ Important Topics
     - ⭐⭐⭐ Frequently Asked Topics 
    - All three categories MUST be present
    - Base importance on exam frequency and weightage

    DIAGRAM RULES:
    - IF INCLUDE DIAGRAM is YES:
     - diagram.data MUST be a SINGLE STRING
     - Valid Mermaid syntax only
     - Must start with: graph ID
     - Wrap EVERY node label in square brackets [ ]
     - DO NOT use special characters inside labels
    - If INCLUDE DIAGRAMS is ON:
     - diagram.data must be "" 
    
      CHART RULES (RECHARTS):
 - IF INCLUDE CHARTS is YES:
  - charts array MUST NOT be empty
  - Generate 1-2 charts, only if they genuinely help exam revision
    (never generate a chart just to satisfy the rule - it must teach something a bullet list can't)

  STEP 1 - Classify the topic's exam-relevant relationship (pick the ONE that fits best):
   - COMPARISON: two or more sub-topics/entities compared on a shared metric
     (e.g. marks weightage per sub-topic, mitosis vs meiosis on shared traits)
     -> use "bar"
   - PROPORTION: parts making up a whole, percentages, composition
     (e.g. composition of blood, distribution of question types in past papers)
     -> use "pie"
   - SEQUENCE / TREND: ordered stages, a process over time, growth, a cycle
     (e.g. steps of photosynthesis, population growth curve, stages of mitosis)
     -> use "line"
   - If NONE of the above genuinely fits the topic -> do not force a chart;
     return "charts": [] even if includeChart is YES, and rely on notes instead

  STEP 2 - Build the chart so it is exam-usable, not decorative:
   - title MUST state the exam-relevant relationship, not just repeat the topic name
     (good: "Weightage of Sub-topics", "Stages of Mitosis by Duration"
      bad: "Biotechnology", "Chart 1")
   - name (x-axis / slice label) MUST be a sub-topic, stage, or exam-recognizable term
     actually mentioned in this topic's notes - never a generic placeholder
   - value MUST represent something a student would actually be tested on or
     benefit from comparing: marks weightage, relative importance (1-10),
     number of questions asked historically, sequential stage number,
     relative duration/proportion - state in "title" what the value represents
   - Every "value" MUST be a positive number between 1 and 10 (NEVER 0, NEVER negative, NEVER a string)
   - Each chart MUST have between 3 and 6 data points (fewer feels empty, more is unreadable on exam-prep cards)
   - Labels must be short and exam-oriented (max 3 words)

 - IF INCLUDE CHARTS is NO:
  - chart must be []

CHART TYPES ALLOWED:
- bar   (COMPARISON)
- line  (SEQUENCE / TREND)
- pie   (PROPORTION)

CHART OBJECT FORMAT (FIELD NAMES ARE EXACT - DO NOT RENAME):
{
 "type": "bar |line |pie",
 "title": "string - must name the exam-relevant relationship shown",
 "data": [
      {"name": "string", "value": 10}
 ]
 }
⚠️ The data key MUST be "value" (singular), NOT "values". The title key MUST be "title", NOT "tittle".
    STRICT JSON FORMAT (DO NOT CHANGE):
    
    {
      "subTopics" : {
      "⭐":[],
      "⭐⭐":[],
      "⭐⭐⭐":[]
      } ,
      "importance": "⭐|⭐⭐|⭐⭐⭐",
      "notes" : "string",
      "revisonPoints": [],
      "questions": {
        "short":[],
        "long":[],
        "diagrams":" "     
      },
      "diagrams":{
      "type": "flowchart |graph|process",
      "data": ""
      },
      "charts":[]

    }
    RETURN ONLY VALID JSON.


    `;
};